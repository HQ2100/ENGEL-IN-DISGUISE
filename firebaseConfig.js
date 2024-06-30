// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDajGmsVnuqnL3hQzl_Aofs7VBU0h5M4Jw",
  authDomain: "engel-77a07.firebaseapp.com",
  databaseURL: "https://engel-77a07-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "engel-77a07",
  storageBucket: "engel-77a07.appspot.com",
  messagingSenderId: "378575182322",
  appId: "1:378575182322:web:61c570465a71b720f1336b",
  measurementId: "G-7P8VY2Y9T4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };