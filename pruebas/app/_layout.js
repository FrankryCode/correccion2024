import { View, Text, StyleSheet } from "react-native"
import { Slot } from "expo-router";

export default function(){
    return (
        <View style={styles.container}>

            <Slot />

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      //alignItems: "center",
      justifyContent: "center",
      
    },
    main: {
      flex: 1,
      justifyContent: "center",
      maxWidth: 960,
      marginHorizontal: "auto",
    },
    title: {
      fontSize: 64,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 36,
      color: "#38434D",
    },
  });