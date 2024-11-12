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
  allowedHeaders: ["Content-Type", "Authorization"],
});

// פונקציה למחיקת הודעות ישנות
export const deleteOldMessages = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(403).send({
        success: false,
        message: "לא נשלח אימות בבקשה",
      });

    if (authHeader !== "LhvaOjtO9ySzkrkUtPkEiN7CilO2") {
      return res.status(403).send({
        success: false,
        message: "האימות שנשלח אינו תקין",
      });
    }

    //  מחיקת ההודעות
    try {
      const messageRef = db.collection("messages");

      const querySnapshot = await messageRef.get();

      querySnapshot.forEach(async (doc) => {
        const mess = doc.data();
        const now = new Date();
        const messageDate = new Date(mess.read_time);

        // מחיקה לאחר 14 ימים (1000 מילישניות * 60 שניות * 60 דקות * 24 שעות * 14 ימים)
        if (
          now.getTime() - messageDate.getTime() > 1000 * 60 * 60 * 24 * 14 &&
          mess.is_read === true
        ) {
          await doc.ref.delete();
        }
      });

      res.status(200).send({
        success: true,
        message: "ההודעות נמחקו בהצלחה",
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן מחיקת ההודעות",
      });
    }
  });
});
