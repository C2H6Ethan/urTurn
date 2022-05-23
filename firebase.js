// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu1f4Spa72HdsC_G2j0F5P_Lfe4Aq3FVo",
  authDomain: "urturn-2c7ee.firebaseapp.com",
  projectId: "urturn-2c7ee",
  storageBucket: "urturn-2c7ee.appspot.com",
  messagingSenderId: "127145718949",
  appId: "1:127145718949:web:42e005a4ca9d1aeb9d094c",
  measurementId: "G-L3ZESPY94C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);