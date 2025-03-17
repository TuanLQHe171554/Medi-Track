import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
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
export default function AddMedicationForm() {
  const [formData, setFormData] = useState({});
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    console.log(formData);
  };
  const SaveMedication = async () => {
    const docId = Date.now().toString();
    const user = await getLocalStorage("userDetails");
  
    if (!formData?.name || !formData?.type?.name || !formData?.type?.icon || 
        !formData?.does || !formData?.startDate || !formData?.endDate || !formData?.reminder) {
      Alert.alert("Nhập đầy đủ các trường");
      return;
    }
    const dates=getDateRange(formData?.startDate,formData?.endDate);
    console.log(dates); 
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        type: { name: formData.type.name, icon: formData.type.icon },  // Đảm bảo type có icon
        userEmail: user?.email,
        docId: docId,
        dates: dates
      };
  
      console.log("Saving to Firestore:", dataToSave);  // Kiểm tra dữ liệu
      await setDoc(doc(db, "medication", docId), dataToSave);
      console.log("Data saved successfully!");
      setLoading(false);
      Alert.alert("Great!","New Medication Added Successfully!",[{
        text:"OK",
        onPress: () => {
          router.push("(tabs)");
        }
      }
      ]);
    } catch (error) {
      setLoading(false);
      console.log("Error saving data:", error);
    }
  };
  

  return (
    <View
      style={{
        padding: 25,
      }}
    >
      <Text style={styles.header}>Add New Medication</Text>
      <View style={styles.inputGroup}>
        <Ionicons
          style={styles.icon}
          name="medkit-outline"
          size={24}
          color="black"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Medicine Name"
          onChangeText={(value) => onHandleInputChange("name", value)}
        />
      </View>
      {/* Type List */}
      <FlatList
        data={TypeList}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.inputGroup,
              { marginRight: 10 },
              {
                backgroundColor:
                  item.name == formData?.type?.name ? Colors.PRIMARY : "white",
              },
            ]}
            onPress={() => onHandleInputChange("type", { name: item.name, icon: item.icon })}
          >
            <Text
              style={[
                styles.typeText,
                {
                  color: item.name == formData?.type?.name ? "white" : "black",
                },
              ]}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      {/*Does Input */}
      <View style={styles.inputGroup}>
        <Ionicons
          style={styles.icon}
          name="eyedrop-outline"
          size={24}
          color="black"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Does 2, 5ml"
          onChangeText={(value) => onHandleInputChange("does", value)}
        />
      </View>
      {/* When to Take DropDown */}
      <View style={styles.inputGroup}>
        <Ionicons
          style={styles.icon}
          name="time-outline"
          size={24}
          color="black"
        />
        <Picker
          selectedValue={formData?.when}
          onValueChange={(itemValue) => onHandleInputChange("when", itemValue)}
          style={{
            width: "90%",
          }}
        >
          {WhenToTake.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
      </View>
      {/* Start and EndDate */}
      <View style={styles.dateInputGroup}>
        <TouchableOpacity
          style={[styles.inputGroup, { flex: 1 }]}
          onPress={() => setShowStartDate(true)}
        >
          <Ionicons
            style={styles.icon}
            name="calendar-outline"
            size={24}
            color="black"
          />
          <Text style={styles.text}>
            {FormatDataForText(formData?.startDate) ?? "StartDate"}
          </Text>
        </TouchableOpacity>
        {showStartDate && (
          <RNDateTimePicker
            minimumDate={new Date()}
            onChange={(event) => {
              onHandleInputChange(
                "startDate",
                FormatDate(event.nativeEvent?.timestamp)
              ),
                setShowStartDate(false);
            }}
            value={new Date(formData?.startDate) ?? new Date()}
          />
        )}
        <TouchableOpacity
          style={[styles.inputGroup, { flex: 1 }]}
          onPress={() => setShowEndDate(true)}
        >
          <Ionicons
            style={styles.icon}
            name="calendar-outline"
            size={24}
            color="black"
          />
          <Text style={styles.text}>
            {FormatDataForText(formData?.endDate) ?? "EndDate"}
          </Text>
        </TouchableOpacity>
        {showEndDate && (
          <RNDateTimePicker
            minimumDate={new Date()}
            onChange={(event) => {
              onHandleInputChange(
                "endDate",
                FormatDate(event.nativeEvent?.timestamp)
              ),
                setShowEndDate(false);
            }}
            value={new Date(formData?.endDate) ?? new Date()}
          />
        )}
      </View>
      {/* Set Reminder Input */}
      <View style={styles.dateInputGroup}>
        <TouchableOpacity
          style={[styles.inputGroup, { flex: 1 }]}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons
            style={styles.icon}  
            name="time-outline"
            size={24}
            color="black"
          />
          <Text style={styles.text}>{formData?.reminder ??"Select Reminder Time"}</Text>
        </TouchableOpacity>
      </View>
      {showTimePicker && (
        <RNDateTimePicker
          mode="time"
          onChange={(event) => {
            onHandleInputChange("reminder", formatTime(event.nativeEvent.timestamp)),  
            setShowTimePicker(false);
          }}
          value={formData?.reminder ? new Date(formData.reminder) : new Date()}
        />
      )}
      <TouchableOpacity 
      onPress={SaveMedication}
      style={styles.button}>
        {loading?<ActivityIndicator size="large" color="white" />:
        <Text style={styles.buttontext}>Add New Medication</Text>}  
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
  button:{
    padding: 12,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    width: "100%",
    marginTop: 25
  },
  buttontext:{
    fontSize:17,
    color: "white",
    textAlign: "center",
  }
});
