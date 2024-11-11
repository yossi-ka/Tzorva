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

//  פונקציה לעריכת הודעה
export const editMessage = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const messages = req.body;

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

        //  עדכון ההודעות

        for (let i = 0; i < messages.length; i++) {
          const messId = messages[i].id;
          const docRef = db.collection("messages").doc(messId);
          const doc = await docRef.get();
          if (!doc.exists) {
            return res.status(404).json({
              success: false,
              message: "המסמך לא נמצא",
            });
          }
          if (doc.data().from === userData.user_id) {
            return res.status(403).json({
              success: false,
              message: "לא ניתן לערוך הודעות שנשלחו",
              error: messages[i],
            });
          }
          //  בדיקת הרשאות
          if (messages[i].user_id !== userData.user_id) {
            return res.status(403).json({
              success: false,
              message: "אין לך הרשאה לערוך את ההודעה",
              error: messages[i],
            });
          }

          delete messages[i].id;
          delete messages[i].user_id;
          // אם המסמך נמצא, המשך לעדכון
          await docRef.update(messages[i]);
        }
        res.status(200).json({
          success: true,
          message: "ההודעות עודכנו בהצלחה",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בעריכת ההודעות",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});
