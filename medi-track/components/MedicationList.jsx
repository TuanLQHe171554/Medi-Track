import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getDateRangeToDisplay } from "../service/ConvertDateTime";
import Colors from "../constant/Colors";
import moment from "moment";
import { getLocalStorage } from "../service/Storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import MedicationCardItem from "./MedicationCardItem";
import EmptyState from "./EmptyState";
import { useRouter } from "expo-router";
export default function MedicationList() {
  const router = useRouter();
  const [medList, setMedList] = useState();
  const [dateRange, setDateRange] = useState();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("MM/DD/YYYY")
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getDateRangeList();
    GetMedicationList(selectedDate);
  }, []);

  const getDateRangeList = () => {
    const dateRange = getDateRangeToDisplay();
    setDateRange(dateRange);
  };
  const GetMedicationList = async (selectedDate) => {
    setLoading(true);
    const user = await getLocalStorage("userDetails");
    setMedList([]);
    try {
      const q = query(
        collection(db, "medication"),
        where("userEmail", "==", user?.email),
        where("dates", "array-contains", selectedDate)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        console.log("docId:" + doc.id + "==>", doc.data());
        setMedList((prev) => [...prev, doc.data()]);
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        marginTop: 25,
      }}
    >
      <Image
        source={require("./../assets/images/medication.png")}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 15,
        }}
      />
      <FlatList
        horizontal
        data={dateRange}
        style={{
          marginTop: 15,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.dateGroup,
              {
                backgroundColor:
                  item.formatedDate == selectedDate
                    ? Colors.PRIMARY
                    : Colors.LIGHT_GRAY,
              },
            ]}
            onPress={() => {
              setSelectedDate(item.formatedDate);
              GetMedicationList(item.formatedDate);
            }}
          >
            <Text
              style={[
                styles.day,
                {
                  color: item.formatedDate == selectedDate ? "white" : "black",
                },
              ]}
            >
              {item.day}
            </Text>
            <Text
              style={[
                styles.date,
                {
                  color: item.formatedDate == selectedDate ? "white" : "black",
                },
              ]}
            >
              {item.date}
            </Text>
          </TouchableOpacity>
        )}
      />
      {medList?.length > 0 ? (
        <FlatList
          data={medList}
          onRefresh={() => GetMedicationList(selectedDate)}
          refreshing={loading}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => router.push({
              pathname: "/action-modal",
              params: {
                ...item,
                selectedDate:selectedDate
              },
            })}>
              <MedicationCardItem medicine={item} selectedDate={selectedDate}/>
            </TouchableOpacity>
          )}
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateGroup: {
    padding: 15,
    backgroundColor: Colors.LIGHT_GRAY,
    display: "flex",
    alignItems: "center",
    marginRight: 20,
    borderRadius: 10,
  },
  day: {
    fontSize: 20,
  },
  date: {
    fontSize: 26,
    fontWeight: "bold",
  },
});
