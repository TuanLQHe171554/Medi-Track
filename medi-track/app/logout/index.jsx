// app/logout/index.jsx
import { View, Text, Alert, ToastAndroid } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { RemoveLocalStorage } from "../../service/Storage";
import { signOut } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";

export default function Logout() {
  const router = useRouter();

  // Hàm xác nhận logout
  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout", // Tiêu đề của hộp thoại
      "Are you sure you want to log out?", // Nội dung của hộp thoại
      [
        {
          text: "No", // Nếu người dùng chọn No
          onPress: () => {
            console.log("Logout canceled");
            router.push("/(tabs)"); // Điều hướng lại về trang chính (hoặc trang bất kỳ bạn muốn)
          },
          style: "cancel", // Đánh dấu là nút hủy
        },
        {
          text: "Yes", // Nếu người dùng chọn Yes
          onPress: async () => {
            try {
              // Xóa thông tin người dùng khỏi LocalStorage
              await RemoveLocalStorage("userDetails");

              // Đăng xuất khỏi Firebase
              await signOut(auth);

              // Hiển thị thông báo Toast Android
              ToastAndroid.show("Successfully logged out", ToastAndroid.SHORT);

              // Điều hướng về trang đăng nhập
              router.push("/login"); // Điều hướng về trang login
            } catch (error) {
              console.error("Error while logging out:", error);
              ToastAndroid.show("Error during logout", ToastAndroid.LONG);
            }
          },
        },
      ],
      { cancelable: false } // Không thể hủy khi nhấn ra ngoài
    );
  };

  useEffect(() => {
    handleLogout(); // Gọi hàm handleLogout khi trang tải
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Logging out...</Text>
    </View>
  );
}
