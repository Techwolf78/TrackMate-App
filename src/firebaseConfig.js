import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

// Correct the firebaseConfig structure
const firebaseConfig = {
  apiKey: "AIzaSyCDLL_kOgfDZmGJwya2RUMUcSak4axjL6c",
  authDomain: "visit-app-68717.firebaseapp.com",
  databaseURL: "https://visit-app-68717-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "visit-app-68717",
  storageBucket: "visit-app-68717.firebasestorage.app",
  messagingSenderId: "847779288690",
  appId: "1:847779288690:web:0e4bd74d33618f563fd4eb",
  measurementId: "G-L3DGJQEM2W"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage, db, signInWithEmailAndPassword, sendPasswordResetEmail };
