
import { StyleSheet, View, Image, SafeAreaView } from 'react-native';
import Icon from '../assets/ucelog.png';

 export default function SplashScreen(){
    return (
        <SafeAreaView style={styles.container} >
            <View>
                <Image source = {Icon} style={styles.image}/>
            </View> 
        </SafeAreaView>
    );
 }


 const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    image:{
        width:100,
        height:100,
        alignContent:"center",
    }
  });
  

  