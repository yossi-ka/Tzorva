import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const serviceAccount = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

const app = initializeApp(serviceAccount); // אתחול האפליקציה
const db = getFirestore(app); // קבלת המופע של Firestore

export { app, db }; // ייצוא db וגם app אם תצטרך את זה
