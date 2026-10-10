
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCw1HfS23ajs0RZUk2biUxtphLKSibu46U",
  authDomain: "scp-platform-98183.firebaseapp.com",
  projectId: "scp-platform-98183",
  storageBucket: "scp-platform-98183.firebasestorage.app",
  messagingSenderId: "452736645260",
  appId: "1:452736645260:web:bed2008d8df2b357ace3a9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
