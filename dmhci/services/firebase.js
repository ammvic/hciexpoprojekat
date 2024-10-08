// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import the auth module

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdY_rX4R7bfgk-S4kyHQzbLLQ1HNdvj30",
  authDomain: "expodm-616f1.firebaseapp.com",
  projectId: "expodm-616f1",
  storageBucket: "expodm-616f1.appspot.com",
  messagingSenderId: "588002619489",
  appId: "1:588002619489:web:6ae961f04777a7825cfa20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app); // Initialize auth

// Now you can use `auth` for authentication operations
export { app, auth }; // Export the app and auth for use in other files
