import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

// Correct the firebaseConfig structure
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Use the VITE_ prefix here
  authDomain: "visit-app-98ce3.firebaseapp.com",
  databaseURL: "https://visit-app-98ce3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "visit-app-98ce3",
  storageBucket: "visit-app-98ce3.firebasestorage.app",
  messagingSenderId: "253059760151",
  appId: "1:253059760151:web:3a726e6c9414969076dc52",
  measurementId: "G-J94K7M9HF0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage, db, signInWithEmailAndPassword, sendPasswordResetEmail };
