import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constant/Colors";
import moment from "moment";
import { getPrevDateRangeToDisplay } from "../../service/ConvertDateTime";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { getLocalStorage } from "../../service/Storage";
import EmptyState from "../../components/EmptyState";
import MedicationCardItem from "../../components/MedicationCardItem";
import { useRouter } from "expo-router";
export default function History() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("MM/DD/YYYY")
  );
  const [dateRange, setDateRange] = useState();
  const [loading, setLoading] = useState(false);
  const [medList, setMedList] = useState();
  useEffect(() => {
    getDateList();
    GetMedicationList(selectedDate);
  }, []);
  const getDateList=()=>{
    const dates = getPrevDateRangeToDisplay();
    setDateRange(dates);
  }
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
    <FlatList
    data={[]}
    style={{
      height: "100%",
      backgroundColor: 'white',
    }}
    ListHeaderComponent={
    <View style={styles.mainContainer}>
      <Image
        style={styles.imageBanner}
        source={require("./../../assets/images/med-history.png")}
      />
      <Text style={styles.header}>Medication history</Text>

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
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/action-modal",
                  params: {
                    ...item,
                    selectedDate: selectedDate,
                  },
                })
              }
            >
              <MedicationCardItem medicine={item} selectedDate={selectedDate}
              showDeleteButton={false} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={{
          fontSize: 25,
          padding: 20,
          fontWeight: "bold",
          color: Colors.GRAY,
          textAlign: "center"
        }}>No Medication Found</Text>
      )}
    </View>}
    />
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    padding: 25,
    backgroundColor: "white",
  },
  imageBanner: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
  },
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
