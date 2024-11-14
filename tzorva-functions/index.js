import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";

// Initialize Firebase Admin
admin.initializeApp();
const db = getFirestore();

const corsHandler = cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization", "uid"],
});

// פונקציה לעריכת פרופיל
export const editProfile = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const uid = req.headers.uid;
      const authHeader = req.headers.authorization;
      const profile = req.body;

      if (!uid) {
        return res.status(403).json({
          success: false,
          message: "לא נשלח אימות uid בבקשה",
        });
      }

      if (!authHeader) {
        return res.status(403).json({
          success: false,
          message: "לא נשלח אימות Token בבקשה",
        });
      }

      const idToken = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      let user;
      try {
        user = await admin.auth().verifyIdToken(idToken);
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "שגיאה באימות ה-ID Token",
        });
      }

      if (uid !== user.uid) {
        return res.status(403).json({
          success: false,
          message: "משתמש לא מאומת",
        });
      }

      // שליפת נתוני משתמש
      const querySnapshot = await db
        .collection("users")
        .where("UID", "==", uid)
        .get();

      if (querySnapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "משתמש לא ידוע",
        });
      }

      // עריכת הפרופיל
      const docRef = querySnapshot.docs[0].ref;
      await docRef.update(profile);
      return res.status(200).json({
        success: true,
        message: "הפרופיל עודכן בהצלחה",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "שגיאה בעריכת הפרופיל",
        error: error.message,
      });
    }
  });
});
