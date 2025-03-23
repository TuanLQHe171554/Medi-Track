import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { useRouter } from "expo-router";

export default function MedicationCardItem({
  medicine,
  selectedDate = "",
  onDelete,
  showDeleteButton = true,
}) {
  const router = useRouter();
  const [status, setStatus] = useState();

  useEffect(() => {
    CheckStatus();
  }, [medicine]);

  const CheckStatus = () => {
    if (Array.isArray(medicine?.action)) {
      const data = medicine?.action.find((item) => item.date == selectedDate);
      setStatus(data);
    } else {
      setStatus(null);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa thuốc này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "medication", medicine.docId));
            onDelete(medicine.docId);
          } catch (error) {
            console.error("Error deleting medication:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Left Section: Image, Name, and Details */}
      <View style={styles.leftContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: medicine?.type?.icon }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{medicine?.name}</Text>
          <Text style={styles.when}>{medicine?.when}</Text>
        </View>
      </View>

      {/* Right Section: Reminder and Actions */}
      <View style={styles.rightContainer}>
        <View style={styles.reminderContainer}>
          <Ionicons name="timer-outline" size={20} color="black" />
          <Text style={styles.reminderText}>{medicine?.reminder}</Text>
        </View>
        {showDeleteButton && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/edit-medication",
                  params: { docId: medicine.docId.toString() },
                });
              }}
              style={styles.actionButton}
            >
              <Ionicons name="pencil-outline" size={20} color={Colors.PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Status Icon (if applicable) */}
      {status?.date && (
        <View style={styles.statusContainer}>
          {status?.status === "Taken" ? (
            <Ionicons name="checkmark-circle" size={24} color={Colors.GREEN} />
          ) : (
            status?.status === "Missed" && (
              <Ionicons name="close-circle" size={24} color="red" />
            )
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Chiếm không gian còn lại
  },
  imageContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
    marginRight: 15,
  },
  image: {
    width: 50,
    height: 50,
  },
  detailsContainer: {
    flex: 1, // Đảm bảo phần chi tiết chiếm hết không gian còn lại
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  when: {
    fontSize: 16,
    color: Colors.GRAY,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    marginBottom: 5,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
  statusContainer: {
    position: "absolute",
    top: 5,
    left: 5,
  },
});