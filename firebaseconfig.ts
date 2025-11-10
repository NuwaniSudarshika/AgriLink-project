import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwRCx_fhNBRP7H-Ma2lNVUf9wF9A8MQzk",
  authDomain: "agrilink-8e85a.firebaseapp.com",
  projectId: "agrilink-8e85a",
  storageBucket: "agrilink-8e85a.firebasestorage.app",
  messagingSenderId: "464568267391",
  appId: "1:464568267391:web:561912448fc5f7cfbc854a",
  measurementId: "G-RBYB4EGF15"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
