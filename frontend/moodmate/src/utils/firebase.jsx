import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: "portfolio-builder-website.firebaseapp.com",
  databaseURL:
    "https://portfolio-builder-website-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portfolio-builder-website",
  storageBucket: "portfolio-builder-website.firebasestorage.app",
  messagingSenderId: "66320670861",
  appId: "1:66320670861:web:3bae0de43c1aa35715c2c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
