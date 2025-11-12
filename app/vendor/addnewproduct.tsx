// app/vendor/addnewproduct.tsx
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { auth, db, storage } from '../../firebaseconfig'; // ensure storage is exported from firebaseconfig

export default function AddNewProduct() {
  const router = useRouter();
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [isSurplus, setIsSurplus] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pick = async () => {
    try {
      const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!p.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library.');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,
        allowsEditing: true,
      });

      // New API: res.canceled (boolean) and res.assets (array)
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setImgUri(res.assets[0].uri ?? null);
      }
    } catch (err: any) {
      Alert.alert('Image picker error', err.message || String(err));
    }
  };

  const upload = async () => {
    if (!title.trim() || !price.trim() || !qty.trim()) {
      Alert.alert('Validation', 'Please fill required fields.');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = '';
      if (imgUri) {
        // create a storage ref and upload the file as a blob
        const filename = `products/${uuidv4()}`;
        const storageRef = ref(storage, filename);

        // fetch the local file uri and convert to blob
        const response = await fetch(imgUri);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const user = auth.currentUser;
      await addDoc(collection(db, 'products'), {
        title,
        description: desc,
        price: Number(price),
        quantity: Number(qty),
        vendorId: user?.uid ?? null,
        vendorName: user?.email ?? 'Vendor',
        imageUrl,
        isSurplus,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Saved', 'Product uploaded successfully.');
      router.back();
    } catch (e: any) {
      Alert.alert('Upload error', e.message ?? String(e));
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Add Product</Text>

      <TouchableOpacity onPress={pick} style={styles.pickBtn}>
        <Text style={{ color: '#fff' }}>{imgUri ? 'Change Image' : 'Pick Image'}</Text>
      </TouchableOpacity>

      {imgUri ? <Image source={{ uri: imgUri }} style={styles.img} /> : null}

      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={desc} onChangeText={setDesc} />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Quantity (kg)" value={qty} onChangeText={setQty} keyboardType="numeric" />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <TouchableOpacity onPress={() => setIsSurplus(!isSurplus)} style={{ marginRight: 10 }}>
          <Text>{isSurplus ? '✅ Surplus' : '⭕ Surplus'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#666' }}>Mark as slightly damaged/excess</Text>
      </View>

      <TouchableOpacity style={[styles.saveBtn, uploading && { opacity: 0.6 }]} onPress={upload} disabled={uploading}>
        <Text style={{ color: '#fff' }}>{uploading ? 'Uploading...' : 'Save Product'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  h1: { fontSize: 20, fontWeight: '700', color: '#E65100', marginBottom: 12 },
  pickBtn: { backgroundColor: '#E65100', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  img: { width: 160, height: 120, borderRadius: 8, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 8 },
  saveBtn: { backgroundColor: '#2E7D32', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
});
