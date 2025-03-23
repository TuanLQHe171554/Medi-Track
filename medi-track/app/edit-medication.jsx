import { View, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import MedicationHeader from "../components/AddMedicationHeader";
import EditMedicationForm from "../components/EditMedicationForm";
import Colors from "../constant/Colors";

export default function EditMedication() {
  const params = useLocalSearchParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      const docId = params?.docId; // Lấy docId một lần
      if (docId) {
        try {
          const docRef = doc(db, "medication", docId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Fetched medicine from Firestore:", docSnap.data());
            setMedicine(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log("Error fetching medicine:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No docId provided in params");
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [params?.docId]); // Chỉ phụ thuộc vào params.docId

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <MedicationHeader title="Edit Medication" />
      <EditMedicationForm medicine={medicine} />
    </ScrollView>
  );
}