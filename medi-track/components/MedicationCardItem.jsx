import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MedicationCardItem({ medicine }) {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: medicine?.type?.icon }}
            style={{
              width: 60,
              height: 60,
            }}
          />
        </View>
        <View>
            <Text style={{fontSize:22, fontWeight:'bold'}}>{medicine?.name}</Text>
            <Text style={{fontSize:17}}>{medicine?.when}</Text>
            <Text style={{color:'white'}}>{medicine?.does} {medicine?.type?.name}</Text>

        </View>
      </View>
      <View style={styles.reiminder}>
        <Ionicons name="timer-outline" size={24} color="black" />
        <Text style={{fontSize:18, fontWeight:'bold'}}>{medicine?.reminder}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container:{
        padding:10,
        // backgroundColor:Colors.LIGHT_PRIMARY,
        borderWidth:1,
        borderColor:Colors.LIGHT_GRAY,
        marginTop:10,
        borderRadius:15,
        justifyContent:'space-between',
        flexDirection:'row',
        width:'100%',
        alignItems:'center'
    },
  imageContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
    marginRight: 15,
  },
  subContainer:{
    flexDirection:'row',
    alignItems:'center',
  },
  reiminder:{
    padding:12,
    // backgroundColor:'white',
    borderRadius:15,
    alignItems:'center',
    borderWidth:1,
    borderColor:Colors.LIGHT_GRAY
  }
});
