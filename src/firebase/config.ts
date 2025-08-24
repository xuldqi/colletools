// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyX3jA5RwWZtRjaGr4p0SuxMUNazYZYRI",
  authDomain: "colletools.firebaseapp.com",
  projectId: "colletools",
  storageBucket: "colletools.firebasestorage.app",
  messagingSenderId: "756249554115",
  appId: "1:756249554115:web:db4e1a99679ccee2ca0676",
  measurementId: "G-N8ZBEFH534"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
export default firebaseConfig;