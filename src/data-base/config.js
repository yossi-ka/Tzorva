import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './config.json';

const app = initializeApp(firebaseConfig); // אתחול האפליקציה
const db = getFirestore(app); // קבלת המופע של Firestore

export { app, db }; // ייצוא db וגם app אם תצטרך את זה

