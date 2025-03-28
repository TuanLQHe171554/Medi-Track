import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import MedicationCardItem from "../../components/MedicationCardItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import moment from "moment";

export default function MedicationActionModal() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse lại dữ liệu type từ chuỗi JSON
  const medicine = {
    ...params,
    type: params.type ? JSON.parse(params.type) : { icon: "" },
  };

  console.log("Medicine data:", medicine);
  console.log("Type icon:", medicine?.type?.icon);

  const UpdateActionStatus = async (status) => {
    try {
      const docRef = doc(db, "medication", medicine?.docId);
      await updateDoc(docRef, {
        action: arrayUnion({
          status: status,
          time: moment().format("LT"),
          date: medicine?.selectedDate,
        }),
      });
      Alert.alert(status, "Response Saved!", [
        {
          text: "OK",
          onPress: () => router.replace("(tabs)"),
        },
      ]);
    } catch (error) {
      console.log("Error in UpdateActionStatus:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/notification.png")}
        style={{
          width: 120,
          height: 120,
        }}
      />
      <Text style={{ fontSize: 18 }}>{medicine?.selectedDate}</Text>
      <Text style={{ fontSize: 30, fontWeight: "bold", color: Colors.PRIMARY }}>
        {medicine?.reminder}
      </Text>
      <Text style={{ fontSize: 18 }}>It's time to take</Text>

      <MedicationCardItem medicine={medicine} showDeleteButton={false} />
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => UpdateActionStatus("Missed")}
        >
          <Ionicons name="close-outline" size={24} color="red" />
          <Text style={{ fontSize: 20, color: "red" }}>Missed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.successBtn}
          onPress={() => UpdateActionStatus("Taken")}
        >
          <Ionicons name="checkmark-outline" size={24} color="white" />
          <Text style={{ fontSize: 20, color: "white" }}>Taken</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          bottom: 25,
        }}
      >
        <Ionicons name="close-circle" size={44} color={Colors.GRAY} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    height: "100%",
  },
  btnContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },
  closeBtn: {
    padding: 10,
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    alignItems: "center",
    borderColor: "red",
    borderRadius: 10,
  },
  successBtn: {
    padding: 10,
    flexDirection: "row",
    gap: 6,
    backgroundColor: Colors.GREEN,
    alignItems: "center",
    borderRadius: 10,
  },
});