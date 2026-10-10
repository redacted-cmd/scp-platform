
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw1HfS23ajs0RZUk2biUxtphLKSibu46U",
  authDomain: "scp-platform-98183.firebaseapp.com",
  projectId: "scp-platform-98183",
  storageBucket: "scp-platform-98183.firebasestorage.app",
  messagingSenderId: "452736645260",
  appId: "1:452736645260:web:bed2008d8df2b357ace3a9",
  measurementId: "G-SZDEQLRRQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
