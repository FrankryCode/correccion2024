from flask import Flask, request, jsonify, json
from dotenv import load_dotenv
import os
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.callbacks import get_openai_callback
import openai
import requests
from transformers import pipeline
from flask import Flask, request, jsonify, render_template
import json


guardarData = []

# Inicializa el clasificador fuera de la función para mejorar el rendimiento
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Desactiva la salida detallada de la biblioteca langchain
import langchain
langchain.verbose = False


openai.api_key = 'OPEN_API_KEY'

# Carga las variables de entorno desde un archivo .env
load_dotenv()

# Inicializa la aplicación Flask
app = Flask(__name__)

# Función para procesar el texto extraído de un archivo PDF
def process_text(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )

    chunks = text_splitter.split_text(text)
    embeddings = OpenAIEmbeddings(openai_api_key=os.environ.get("OPENAI_API_KEY"))
    knowledge_base = FAISS.from_texts(chunks, embeddings)
    return knowledge_base

# Endpoint para procesar un archivo PDF y una consulta
@app.route('/ask', methods=['POST'])
def ask():
    
    # Imprime el nombre y tipo del archivo PDF
    print(f"Archivo recibido: {request.files['pdf']}")
    print(f"Tipo de archivo: {request.form.get('query')}")
    
    # Obtener archivo PDF y consulta del cuerpo de la solicitud
    if 'pdf' not in request.files:
        return jsonify({'error': 'No PDF file provided'}), 400
    
    pdf_file = request.files['pdf']
    query = request.form.get('query')
    
 
    
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    # Leer el contenido del archivo PDF
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()

    # Crear una base de conocimientos a partir del texto del PDF
    knowledgeBase = process_text(text)

    # Realizar una búsqueda de similitud en la base de conocimientos
    docs = knowledgeBase.similarity_search(query)

    # Inicializar un modelo de lenguaje de OpenAI
    model = "gpt-3.5-turbo-instruct"
    temperature = 0
    llm = OpenAI(openai_api_key=os.environ.get("OPENAI_API_KEY"), model_name=model, temperature=temperature)

    # Cargar la cadena de preguntas y respuestas
    chain = load_qa_chain(llm, chain_type="stuff")

    # Obtener la realimentación de OpenAI para el procesamiento de la cadena
    with get_openai_callback() as cost:
        response = chain.invoke(input={"question": query, "input_documents": docs})
        print(cost)  # Imprime el costo de la operación
        print(response) #
        return jsonify({'response': response["output_text"]})




@app.route('/openapi', methods = ['POST'])
def openapi():
    data = request.json
    user_message = data.get('llamada')
    user_value = data.get('valor')

    conversation = [{
        "role": "system",
        "content": f"""Quiero que clasifiques el mensaje que y estimes ademas quiero que guardes un historial de las respuestas que entreges. Aquí están los datos:

        - Mensaje: {user_message}
        - Valor: {user_value}

        Primero, clasificas el mensaje si es que pertenece a uno de estos tres temas.

        - Cine
        - Pólitica    
        - Religón

        Finalmente, guardas el historial de respuestas que entregres. 

        Proporciona la respuesta en el siguiente formato JSON:

        {{
        "label": la etiqueta del tema que clasificaste entre las 3,
        "valor": "el valor que te enviaron desde un inicio"
        }}"""
    }]

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=conversation,
        temperature=0,
        max_tokens=500
    )

    respuesta = response.choices[0].message['content']
    print(f"Respuesta cruda: {respuesta}")
    
    # Eliminar delimitadores de bloque de código
    if respuesta.startswith("```json\n") and respuesta.endswith("\n```"):
        respuesta = respuesta[8:-4].strip()
    
    print(f"Respuesta sin delimitadores: {respuesta}")

    try:
        # Validar si la respuesta es un JSON válido
        respuesta_json = json.loads(respuesta)

        # Añadir la respuesta al historial
        guardarData.append(respuesta_json)
        print(f"Historial actualizado: {guardarData}")

        # Devolver el historial completo
        return jsonify(guardarData)

    except json.JSONDecodeError as e:
        print(f"Error decodificando JSON: {e}")
        return jsonify({"error": "Error decodificando la respuesta de OpenAI"}), 500


@app.route('/clasificar', methods=['POST'])
def classify_text():
    data = request.get_json()
    valor = data.get('valor', '')
    texto = data.get('llamada', '')
    
    if not texto:
        return jsonify({'error': 'No se proporcionó ningún texto.'}), 400
    
    candidate_labels = [
        'Cine', 'Política', 'Religión'
    ]
    resultado_clasificacion = classifier(texto, candidate_labels, multi_label=True)
    
    # Verificar que el modelo esté devolviendo las puntuaciones correctamente
    print("Resultado de la clasificación:", resultado_clasificacion)
    
    max_score_idx = resultado_clasificacion['scores'].index(max(resultado_clasificacion['scores']))
    label_score = resultado_clasificacion['labels'][max_score_idx]
    
    respuestasData = {'label':label_score, 'valor':  valor}

    guardarData.append(respuestasData)

    print("ENVIAR", respuestasData)

    return jsonify({'label': label_score, 'valor': valor})




# Punto de entrada para la ejecución del programa
if __name__ == "__main__":
     app.run(port=80, debug=True, host='0.0.0.0')
