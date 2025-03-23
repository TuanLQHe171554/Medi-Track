import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import Ionicons from "@expo/vector-icons/Ionicons";
  import Colors from "../constant/Colors";
  import { TypeList, WhenToTake } from "../constant/Option";
  import { Picker } from "@react-native-picker/picker";
  import RNDateTimePicker from "@react-native-community/datetimepicker";
  import { FormatDataForText, FormatDate, formatTime, getDateRange } from "../service/ConvertDateTime";
  import { getLocalStorage } from "../service/Storage";
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../config/FirebaseConfig";
  import { useRouter } from "expo-router";
  
  export default function EditMedicationForm({ medicine }) {
    const [formData, setFormData] = useState({});
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      if (medicine && Object.keys(formData).length === 0) {
        setFormData(medicine);
      }
    }, [medicine, formData]);
  
    const onHandleInputChange = (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  
    const parseTimestampToDate = (timestamp) => {
      if (!timestamp) return new Date();
      return new Date(timestamp);
    };
  
    const parseTime = (timeString) => {
      if (!timeString) return new Date();
      const [time, period] = timeString.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date;
    };
  
    const UpdateMedication = async () => {
      const user = await getLocalStorage("userDetails");
  
      if (
        !formData?.name ||
        !formData?.type?.name ||
        !formData?.type?.icon ||
        !formData?.does ||
        !formData?.startDate ||
        !formData?.endDate ||
        !formData?.reminder
      ) {
        Alert.alert("Nhập đầy đủ các trường");
        return;
      }
  
      const dates = getDateRange(formData?.startDate, formData?.endDate);
      setLoading(true);
  
      try {
        const dataToSave = {
          ...formData,
          type: { name: formData.type.name, icon: formData.type.icon },
          userEmail: user?.email,
          docId: formData.docId,
          dates: dates,
        };
  
        await setDoc(doc(db, "medication", formData.docId), dataToSave, { merge: true });
        setLoading(false);
        Alert.alert("Great!", "Medication Updated Successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.push("(tabs)");
            },
          },
        ]);
      } catch (error) {
        setLoading(false);
        console.log("Error updating data:", error);
      }
    };
  
    return (
      <View style={{ padding: 25 }}>
        <Text style={styles.header}>Edit Medication</Text>
  
        <View style={styles.inputGroup}>
          <Ionicons style={styles.icon} name="medkit-outline" size={24} color="black" />
          <TextInput
            style={styles.textInput}
            placeholder="Medicine Name"
            value={formData?.name || ""}
            onChangeText={(value) => onHandleInputChange("name", value)}
          />
        </View>
  
        <FlatList
          data={TypeList}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.inputGroup,
                { marginRight: 10 },
                {
                  backgroundColor:
                    item.name === formData?.type?.name ? Colors.PRIMARY : "white",
                },
              ]}
              onPress={() => onHandleInputChange("type", { name: item.name, icon: item.icon })}
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    color: item.name === formData?.type?.name ? "white" : "black",
                  },
                ]}
              >
                {item?.name}
              </Text>
            </TouchableOpacity>
          )}
        />
  
        <View style={styles.inputGroup}>
          <Ionicons style={styles.icon} name="eyedrop-outline" size={24} color="black" />
          <TextInput
            style={styles.textInput}
            placeholder="Does 2, 5ml"
            value={formData?.does || ""}
            onChangeText={(value) => onHandleInputChange("does", value)}
          />
        </View>
  
        <View style={styles.inputGroup}>
          <Ionicons style={styles.icon} name="time-outline" size={24} color="black" />
          <Picker
            selectedValue={formData?.when || ""}
            onValueChange={(itemValue) => onHandleInputChange("when", itemValue)}
            style={{ width: "90%" }}
          >
            {WhenToTake.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        </View>
  
        <View style={styles.dateInputGroup}>
          <TouchableOpacity
            style={[styles.inputGroup, { flex: 1 }]}
            onPress={() => setShowStartDate(true)}
          >
            <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
            <Text style={styles.text}>
              {formData?.startDate ? FormatDataForText(parseTimestampToDate(formData.startDate)) : "Start Date"}
            </Text>
          </TouchableOpacity>
          {showStartDate && (
            <RNDateTimePicker
              minimumDate={new Date()}
              onChange={(event) => {
                onHandleInputChange("startDate", FormatDate(event.nativeEvent?.timestamp));
                setShowStartDate(false);
              }}
              value={formData?.startDate ? parseTimestampToDate(formData.startDate) : new Date()}
            />
          )}
          <TouchableOpacity
            style={[styles.inputGroup, { flex: 1 }]}
            onPress={() => setShowEndDate(true)}
          >
            <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
            <Text style={styles.text}>
              {formData?.endDate ? FormatDataForText(parseTimestampToDate(formData.endDate)) : "End Date"}
            </Text>
          </TouchableOpacity>
          {showEndDate && (
            <RNDateTimePicker
              minimumDate={new Date()}
              onChange={(event) => {
                onHandleInputChange("endDate", FormatDate(event.nativeEvent?.timestamp));
                setShowEndDate(false);
              }}
              value={formData?.endDate ? parseTimestampToDate(formData.endDate) : new Date()}
            />
          )}
        </View>
  
        <View style={styles.dateInputGroup}>
          <TouchableOpacity
            style={[styles.inputGroup, { flex: 1 }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons style={styles.icon} name="time-outline" size={24} color="black" />
            <Text style={styles.text}>{formData?.reminder || "Select Reminder Time"}</Text>
          </TouchableOpacity>
        </View>
        {showTimePicker && (
          <RNDateTimePicker
            mode="time"
            onChange={(event) => {
              onHandleInputChange("reminder", formatTime(event.nativeEvent.timestamp));
              setShowTimePicker(false);
            }}
            value={formData?.reminder ? parseTime(formData.reminder) : new Date()}
          />
        )}
  
        <TouchableOpacity onPress={UpdateMedication} style={styles.button}>
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Text style={styles.buttontext}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    header: {
      fontSize: 25,
      fontWeight: "bold",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      marginTop: 10,
      backgroundColor: "white",
    },
    textInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
    },
    icon: {
      color: Colors.PRIMARY,
      borderRightWidth: 1,
      paddingRight: 12,
      borderColor: Colors.GRAY,
    },
    typeText: {
      fontSize: 16,
    },
    text: {
      fontSize: 15,
      padding: 5,
      flex: 1,
      marginLeft: 10,
    },
    dateInputGroup: {
      flexDirection: "row",
      gap: 10,
    },
    button: {
      padding: 12,
      backgroundColor: Colors.PRIMARY,
      borderRadius: 15,
      width: "100%",
      marginTop: 25,
    },
    buttontext: {
      fontSize: 17,
      color: "white",
      textAlign: "center",
    },
  });