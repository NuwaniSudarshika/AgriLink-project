import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseconfig';
import styles from './styles/SignupStyles';

export default function Signup() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer'|'vendor'>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
     alert('Passwords do not match.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db,'users', user.uid), { fullName, email, role, createdAt: new Date() });
      alert('Successfully Account created!');
      if (role === 'buyer' || role === 'vendor'){
        router.push("/login");
      }
    } catch (err: any) {
      alert( err.message);
    }
  };

  return (
     <ScrollView contentContainerStyle={styles.scrollContainer}>

    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Image
        source={require("../assets/Logo.jpg")}
        style={{ width: 150, height: 150, alignSelf: "center", marginTop: 4 }}
      />

      <View style={styles.container}>
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

        <TouchableOpacity onPress={() => router.push('/login')}><Text style={styles.linkText}>Already have an account?<Text style={styles.loginButtonText}>Log In</Text></Text></TouchableOpacity>
      </View>
        </View>
    </ScrollView>
   
  );
}
