// app/signup.tsx
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseconfig';
import styles from './styles/SignupStyles'; // keep your styles folder under app/

export default function Signup() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer'|'vendor'>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error','Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error','Passwords do not match.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db,'users', user.uid), { fullName, email, role, createdAt: new Date() });
      Alert.alert('Success','Account created!');
      if (role === 'buyer') router.replace('/buyerhome');
      else router.replace('/vendorhome');
    } catch (err: any) {
      Alert.alert('Signup Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.logo}>AgriLink</Text>
        <Text style={styles.title}>Create your AgriLink Account</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity style={[styles.roleButton, role === 'buyer' && styles.activeRole]} onPress={() => setRole('buyer')}>
            <Text style={[styles.roleText, role === 'buyer' && styles.activeRoleText]}>I’m a Buyer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.roleButton, role === 'vendor' && styles.activeRole]} onPress={() => setRole('vendor')}>
            <Text style={[styles.roleText, role === 'vendor' && styles.activeRoleText]}>I’m a Vendor</Text>
          </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}><Text style={styles.signupButtonText}>Sign Up</Text></TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}><Text style={styles.linkText}>Already have an account? Log in</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}
