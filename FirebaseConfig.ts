// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyDLgyXUdz1SP43z4hKVm6_3kfbWsVYufiY",
  authDomain: "smartshoppingapp-8158d.firebaseapp.com",
  projectId: "smartshoppingapp-8158d",
  storageBucket: "smartshoppingapp-8158d.firebasestorage.app",
  messagingSenderId: "723516632615",
  appId: "1:723516632615:web:53846c1d3b2a754c762802",
  measurementId: "G-VXTS6N5N4H"
};

// Initialize Firebase
const Firebase_App = initializeApp(firebaseConfig);

export const Firebase_Auth = getAuth(Firebase_App);
export const Firebase_Firestore = getFirestore(Firebase_App);