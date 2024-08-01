import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Linking } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { useEffect, useState } from 'react';
import SplashScreen from './screens/SplashScreen'
import Clasificador from './screens/Clasificador';

export default function App() {

  const [inShowSplash, setInshowSplash]= useState(true);


  useEffect(() => { 
    setTimeout(()=>{
      setInshowSplash(false);
    }, 3000 ); 
  });

  

  return<>{inShowSplash ? <SplashScreen/> : <HomeScreen/>}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
