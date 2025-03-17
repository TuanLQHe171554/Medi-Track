import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { getLocalStorage } from "../service/Storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import Colors from "../constant/Colors";

export default function Header() {
  const [user, setUser] = useState();
  const router=useRouter();
  useEffect(() => {
    GetUserDetail();
  }, []);

  const GetUserDetail = async () => {
    const userInfo = await getLocalStorage("userDetails");
    console.log(userInfo);
    setUser(userInfo);
  };

  return (
    <View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={require("./../assets/images/smiley.png")}
            style={{
              width: 48,
              height: 48,
            }}
          />
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            {user?.displayName} 👋
          </Text>
        </View>
        <TouchableOpacity onPress={()=>router.push("/add-new-medication")}>
          <Ionicons name="medkit-outline" size={34} color={Colors.PRIMARY} />
        </TouchableOpacity>
        
      </View>
    </View>
  );
}
