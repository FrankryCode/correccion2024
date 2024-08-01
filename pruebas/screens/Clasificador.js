import { Link } from "expo-router";
import React, {useState} from "react";
import {Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList } from "react-native";


const Clasificador = () => {
    const [llamada, setLlamada] = useState('');
    const [valor, setValor] = useState('');
    const [results, setResults] = useState([]);

    const getResultFromClasificar = async () => {
      try {
        const dataToSend = { llamada, valor };
        console.log("JSON to send:", JSON.stringify(dataToSend, null, 2));
  
  
        const response = await fetch("http://192.168.100.5:80/openapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ llamada, valor }),
        });
        const jsonData = await response.json();
        console.log("JSON received:", JSON.stringify(jsonData, null, 2));
        // Supongo que jsonData tiene la estructura { historial: [...] }
        setResults(jsonData || []);
      } catch (error) {
        console.log(error);
      }
    };
    
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {"Ingrese el texto que desea conocer la clasificacion"}
        </Text>
        
        <TextInput 
          style={styles.input} 
          value={llamada} 
          onChangeText={setLlamada} 
          placeholder="Ingrese el texto" 
          placeholderTextColor="#888"
        />
        <TextInput 
          style={styles.input} 
          value={valor} 
          onChangeText={setValor} 
          placeholder="Ingrese el valor" 
          placeholderTextColor="#888"
        />
        
        <TouchableOpacity style={styles.button} onPress={getResultFromClasificar}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        <Link href="/home" style={styles.button} >
          <Text style={styles.buttonText}>Regresar</Text>
        </Link>
        
        <FlatList
                data={results}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.resultContainer}>
                        <Text style={styles.result}>Label: {item.label}</Text>
                        <Text style={styles.result}>Valor: {item.valor}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.result}>No hay resultados.</Text>}
            />
      </View>
    );
  };


const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        width: '80%',
        fontSize: 16,
    },
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    text: {
      fontSize: 18,
      marginBottom: 10,
      marginTop: 10,
      color: '#333',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#6200EE',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
      width: '80%',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      alignContents: 'center',
    },
    result: {
      fontSize: 18,
      marginTop: 20,
      color: '#333',
      textAlign: 'center',
    },
    resultContainer: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        width: '100%',
    },
});
export default Clasificador;
