import { useRouter } from 'expo-router';
import { updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseconfig';

export default function BuyerProfile() {
  const router = useRouter();
  const uid = auth.currentUser?.uid;
  const [data, setData] = useState<any>({ fullName: '', email: '', phone: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'users', uid)).then(snap => {
      if (snap.exists()) setData(snap.data());
    });
  }, [uid]);

  const save = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid!), {
        fullName: data.fullName,
        phone: data.phone,
      });

      if (newPassword) {
        await updatePassword(auth.currentUser!, newPassword);
      }

      Alert.alert('Saved');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Profile</Text>
      <TextInput style={styles.input} value={data.fullName} onChangeText={(t) => setData({ ...data, fullName: t })} placeholder="Full Name" />
      <TextInput style={styles.input} value={data.email} editable={false} />
      <TextInput style={styles.input} value={data.phone} onChangeText={(t) => setData({ ...data, phone: t })} placeholder="Phone" />
      <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="New Password" secureTextEntry />
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" secureTextEntry />
      <TouchableOpacity style={styles.saveBtn} onPress={save}><Text style={{ color: '#fff' }}>Save</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#ccc', marginTop: 8 }]} onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 8 },
  saveBtn: { backgroundColor: '#4CAF50', padding: 12, alignItems: 'center', borderRadius: 8 }
});
