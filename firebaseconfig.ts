import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzZNASsREsS0Y2nGrl1PnCzSJ2GH2iLyA",
  authDomain: "agrilinkproject-b4777.firebaseapp.com",
  projectId: "agrilinkproject-b4777",
  storageBucket: "agrilinkproject-b4777.firebasestorage.app",
  messagingSenderId: "56075299158",
  appId: "1:56075299158:web:2f98db12287f5146e9cef7",
  measurementId: "G-WHMV70CX37",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
