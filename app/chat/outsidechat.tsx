// app/chat/outsidechat.tsx
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { auth, db } from "../../firebaseconfig";

export default function OutsideChat() {
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);

  // buyers see all vendors
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "vendor"));
    const unsub = onSnapshot(q, (snap) =>
      setVendors(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
    );
    return unsub;
  }, []);

  // Check if buyer has added a product from this vendor
  const checkCartForVendor = async (buyerId: string, vendorId: string) => {
    const cartRef = collection(db, "carts", buyerId, "items");
    const q = query(cartRef, where("vendorId", "==", vendorId));
    const snapshot = await getDocs(q);
    return !snapshot.empty; // true if vendor's product found
  };

  const startChat = async (vendorId: string) => {
    const myId = auth.currentUser?.uid;
    if (!myId) return;

    // 1️⃣ Check if buyer has vendor item in cart
    const hasVendorItem = await checkCartForVendor(myId, vendorId);
    if (!hasVendorItem) {
      Alert.alert(
        "Cart Required 🛒",
        "Please add a product from this vendor to your cart before chatting."
      );
      return;
    }

    // 2️⃣ Continue with chat creation if allowed
    const chatId = [myId, vendorId].sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    const existing = await getDoc(chatRef);

    if (!existing.exists()) {
      await setDoc(chatRef, {
        users: [myId, vendorId],
        createdAt: new Date(),
        lastMessage: "",
        updatedAt: new Date(),
      });
    }

    // 3️⃣ Navigate to chat
    router.push({ pathname: "/chat/insidechat", params: { chatId } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Available Vendors</Text>
      <FlatList
        data={vendors}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => startChat(item.id)}
          >
            <Text style={{ fontWeight: "700" }}>
              {item.fullName || item.email}
            </Text>
            {item.bio ? <Text style={{ color: "#666" }}>{item.bio}</Text> : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  h1: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  item: {
    padding: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    marginBottom: 8,
  },
});
