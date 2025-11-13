import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import * as Notifications from "expo-notifications";
import { auth, db } from "../../firebaseconfig";
import { registerForPushNotificationsAsync } from "../../notifications";

export default function InsideChat() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const myId = auth.currentUser?.uid;
  const myName = auth.currentUser?.displayName || "User";

  useEffect(() => {
    registerForPushNotificationsAsync(); // request permission & token
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setMessages(msgs);
    });
    return unsub;
  }, [chatId]);

  // Send message
  const send = async () => {
    if (!text.trim() || !chatId) return;
    const messageData = {
      id: uuidv4(),
      senderId: myId,
      senderName: myName,
      text,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, `chats/${chatId}/messages`), messageData);

    // Update chat summary
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: text,
      lastSender: myId,
      updatedAt: serverTimestamp(),
    });

    // Send local push notification (demo)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Message 💬",
        body: text,
      },
      trigger: null,
    });

    setText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msg,
              item.senderId === myId ? styles.me : styles.them,
            ]}
          >
            <Text style={styles.senderName}>{item.senderName}</Text>
            <Text
              style={{ color: item.senderId === myId ? "#fff" : "#000" }}
            >
              {item.text}
            </Text>
          </View>
        )}
        keyExtractor={(i) => i.id}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Message..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: "#fff" },
  msg: {
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  me: { alignSelf: "flex-end", backgroundColor: "#4CAF50" },
  them: { alignSelf: "flex-start", backgroundColor: "#eee" },
  senderName: { fontSize: 10, color: "#555" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  sendBtn: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
});
