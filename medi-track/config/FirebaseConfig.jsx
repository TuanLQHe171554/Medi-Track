// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHlLkzfPco3cbRxGDKXEbhryu3OfcD4q0",
  authDomain: "meditracker-21edf.firebaseapp.com",
  projectId: "meditracker-21edf",
  storageBucket: "meditracker-21edf.firebasestorage.app",
  messagingSenderId: "992965394344",
  appId: "1:992965394344:web:c24c2f3b9920ece5ba679d",
  measurementId: "G-1548F3LGET"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);