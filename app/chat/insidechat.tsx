// app/chat/insidechat.tsx
import { useLocalSearchParams } from 'expo-router';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { auth, db } from '../../firebaseconfig';

export default function InsideChat() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const myId = auth.currentUser?.uid;

  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('createdAt')
    );
    const unsub = onSnapshot(q, (snap) =>
      setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
    );
    return unsub;
  }, [chatId]);

  const send = async () => {
    if (!text.trim() || !chatId) return;

    // Save message in Firestore
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      id: uuidv4(),
      senderId: myId,
      text,
      createdAt: serverTimestamp(),
    });

    // Reset input field
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msg,
              item.senderId === myId ? styles.me : styles.them,
            ]}>
            <Text
              style={{ color: item.senderId === myId ? '#fff' : '#000' }}>
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
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: '#fff' },
  msg: { padding: 10, borderRadius: 8, marginVertical: 4, maxWidth: '80%' },
  me: { alignSelf: 'flex-end', backgroundColor: '#4CAF50' },
  them: { alignSelf: 'flex-start', backgroundColor: '#eee' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },
  sendBtn: {
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
});
