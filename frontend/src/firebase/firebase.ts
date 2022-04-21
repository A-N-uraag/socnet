// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgixgSbkYtaNbCvc8_QlspK06MWnL_My4",
  authDomain: "socnet-swe.firebaseapp.com",
  projectId: "socnet-swe",
  storageBucket: "socnet-swe.appspot.com",
  messagingSenderId: "444875091384",
  appId: "1:444875091384:web:d145b4cd19c2e8b2e0334d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };