// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKye_m-aeZbAbuJvE9owDqXCwR8DRvSnU",
  authDomain: "playfusion-auth.firebaseapp.com",
  databaseURL: "https://playfusion-auth-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "playfusion-auth",
  storageBucket: "playfusion-auth.appspot.com",
  messagingSenderId: "609480772466",
  appId: "1:609480772466:web:722c9ef5227b1298f76beb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

export {app, db};   