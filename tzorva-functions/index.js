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
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "uid"],
});

// פונקציה לשליחת הודעה
export const sendMessage = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const message = req.body;

        if (!uid) {
          res.status(403).json({
            success: false,
            message: "לא נשלח אימות uid בבקשה",
          });
          return resolve();
        }

        if (!authHeader) {
          res.status(403).json({
            success: false,
            message: "לא נשלח אימות Token בבקשה",
          });
          return resolve();
        }

        const idToken = authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : null;

        let user;
        try {
          user = await admin.auth().verifyIdToken(idToken);
        } catch (error) {
          res.status(401).json({
            success: false,
            message: "שגיאה באימות ה-ID Token",
          });
          return resolve();
        }

        if (uid !== user.uid) {
          res.status(403).json({
            success: false,
            message: "משתמש לא מאומת",
          });
          return resolve();
        }

        // שליפת נתוני משתמש
        const querySnapshot = await db
          .collection("users")
          .where("UID", "==", uid)
          .get();

        if (querySnapshot.empty) {
          res.status(500).json({
            success: false,
            message: "משתמש לא ידוע",
          });
          return resolve();
        }

        const userData = querySnapshot.docs[0].data();

        if (userData.job_title === "מטפל") {
          res.status(403).json({
            success: false,
            message: "אין לך הרשאה לשלוח הודעות",
          });
          return resolve();
        }
        
        //  הוספת נתוני ברירת מחדל להודעה
        const time = new Date();
        message.from = userData.user_id;
        message.is_read = false;
        message.sent_time = time;
        message.read_time = "";
        message.for_keeping = false;

        // שליחת ההודעה
        await db.collection("messages").add(message);

        res.status(200).json({
          success: true,
          message: "ההודעה נשלחה בהצלחה",
        });
        return resolve();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בשליחת ההודעה",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});
