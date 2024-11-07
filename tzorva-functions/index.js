import admin from "firebase-admin"; // ייבוא firebase-admin
import { getFirestore } from "firebase-admin/firestore";
import cors from "cors"; // ייבוא CORS
import { onRequest } from "firebase-functions/v2/https";

// Initialize Firebase Admin
admin.initializeApp();
const db = getFirestore();

const corsHandler = cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization", "uid"],
});


