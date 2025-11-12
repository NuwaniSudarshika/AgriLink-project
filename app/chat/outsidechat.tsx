// app/chat/outsidechat.tsx
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseconfig';

export default function OutsideChat(){
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);

  // buyers should see all vendors (role filter)
  useEffect(()=>{
    const q = query(collection(db,'users'), where('role','==','vendor'));
    const unsub = onSnapshot(q, snap => setUsers(snap.docs.map(d=> ({id:d.id,...d.data() as any}))));
    return unsub;
  },[]);

  const startChat = async (otherId: string) => {
    // compute chatId ordering uids
    const myId = auth.currentUser?.uid;
    if (!myId) return;
    const chatId = [myId, otherId].sort().join('_');
    router.push({ pathname:'./chat/insidechat', params:{ chatId } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Vendors</Text>
      <FlatList data={users} keyExtractor={i=>i.id} renderItem={({item})=>(
        <TouchableOpacity style={styles.item} onPress={()=>startChat(item.id)}>
          <Text style={{fontWeight:'700'}}>{item.fullName || item.email}</Text>
          <Text style={{color:'#666'}}>{item.bio}</Text>
        </TouchableOpacity>
      )}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:16},
  h1:{fontSize:20,fontWeight:'700',marginBottom:12},
  item:{padding:12,backgroundColor:'#F7F7F7',borderRadius:8,marginBottom:8}
});
