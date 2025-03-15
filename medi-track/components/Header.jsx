import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { getLocalStorage } from "../service/Storage";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Header() {
  const [user, setUser] = useState();
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
        <Ionicons name="settings-outline" size={34} color={'#8f8f8f'} />
      </View>
    </View>
  );
}
