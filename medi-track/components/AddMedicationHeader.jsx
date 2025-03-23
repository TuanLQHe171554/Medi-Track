import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function MedicationHeader({ title }) {
  const router = useRouter();

  return (
    <View>
      <Image
        source={require("./../assets/images/consult.png")}
        style={{ width: "100%", height: 300 }}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          padding: 25,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text
        style={{
          position: "absolute",
          bottom: 20,
          left: 25,
          fontSize: 25,
          fontWeight: "bold",
          color: "white",
        }}
      >
        {title}
      </Text>
    </View>
  );
}