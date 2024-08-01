import React from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableWithoutFeedback, Linking } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { Video } from 'expo-av';
import { Link } from 'expo-router';

const linkedin = <Icon name={'linkedin'} size={30} color={'#0A66C2'} />;

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            <View style={styles.videoContainer}>
                <Video
                    source={require('../assets/present.mp4')}
                    style={styles.video}
                    resizeMode="cover"
                    useNativeControls
                    isLooping
                />
            </View>
            <></>
            <Text style={styles.text}>Frank Aldana</Text>
            <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback onPress={() => Linking.openURL('https://linkedin.com/')}>
                    {linkedin}
                </TouchableWithoutFeedback>
            </View>
            
            <Link href="/Class" style={styles.button}>
                <Text style={styles.buttonText}>Ir al clasificador</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        color: "#000",
        fontSize: 24,
        fontWeight: 'bold',
        borderColor: '#6200EE',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#ffffff',
        width: '80%',
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    videoContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: 'hidden',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    video: {
        width: '100%',
        height: '100%',
    },
});
