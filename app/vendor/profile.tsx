import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";


useEffect(() => {
  if (Platform.OS !== 'web') {
    import('expo-notifications').then((Notifications) => {
      Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,  
  }),
});


      // Optional: register for push token
      // Notifications.getExpoPushTokenAsync().then(token => console.log(token));
    });
  }
}, []);

export default function VendorProfile() {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={require("../../assets/profile.png")} style={styles.avatar} />
        <Text style={styles.name}>Jenny Smith</Text>
        <Text style={styles.verified}>Verified Vendor</Text>
        <Text style={styles.rating}>4.8</Text>

        <View style={styles.starsContainer}>
          <Ionicons name="star" size={20} color="#f4c10f" />
          <Ionicons name="star-outline" size={20} color="#ccc" />
          <Ionicons name="star-outline" size={20} color="#ccc" />
          <Ionicons name="star-outline" size={20} color="#ccc" />
          <Ionicons name="star-outline" size={20} color="#ccc" />
        </View>
        <Text style={styles.reviews}>120 reviews</Text>

        <View style={styles.buttonContainer}>
          <Link href="/vendor/editProfileVendor" asChild>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.listBtn}>
            <Text style={styles.listText}>View my listings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoHeader}>Basic Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#555" />
          <Text style={styles.infoText}>Jenny@gmail.com</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="category" size={18} color="#555" />
          <Text style={styles.infoText}>Organic vegetables</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#555" />
          <Text style={styles.infoText}>Sunny Acres Farm</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="#555" />
          <Text style={styles.infoText}>15 years</Text>
        </View>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Notifications</Text>
        <Switch value={isEnabled} onValueChange={toggleSwitch} />
      </View>

      <TouchableOpacity style={styles.optionBtn} onPress={() => Alert.alert('Coming Soon', 'Password change feature is not available yet.')}>
        <Ionicons name="lock-closed-outline" size={18} color="#333" />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  profileHeader: { alignItems: "center", marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  verified: { color: "green", fontWeight: "600", marginBottom: 5 },
  rating: { fontSize: 28, fontWeight: "bold", marginBottom: 5 },
  starsContainer: { flexDirection: "row", marginVertical: 5 },
  reviews: { color: "#777", marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  editBtn: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  listBtn: {
    backgroundColor: "#00b140",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  editText: { color: "#333", fontWeight: "500" },
  listText: { color: "#fff", fontWeight: "500" },
  infoBox: {
    backgroundColor: "#efececff",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  infoHeader: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: { marginLeft: 8, color: "#555" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#efececff",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  switchText: { fontSize: 16, fontWeight: "500" },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#efececff",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  optionText: { marginLeft: 8, fontSize: 16, color: "#333" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    backgroundColor: "#fff",
  },
  logoutText: { marginLeft: 6, color: "#e74c3c", fontWeight: "bold", fontSize: 16 },
});
