import admin from "firebase-admin"; // ייבוא firebase-admin
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import cors from "cors"; // ייבוא CORS

// Initialize Firebase Admin
admin.initializeApp();
const db = getFirestore();

// הגדרת CORS
const corsOptions = { origin: true };
const corsMiddleware = cors(corsOptions);

// פונקציה למחיקת תיעוד פיננסי
export const deleteFinance = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const finance = req.body;

    if (!uid)
      return res.status(403).send({
        success: false,
        message: "לא נשלח אימות uid בבקשה",
      });

    if (!authHeader)
      return res.status(403).send({
        success: false,
        message: "לא נשלח אימות Token בבקשה",
      });

    const idToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    let user;
    try {
      user = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      return res.status(401).send({
        success: false,
        message: "שגיאה באימות ה-ID Token",
      });
    }
    const uidFromIdtoken = user.uid;
    if (uid !== uidFromIdtoken) {
      return res.status(403).send({
        success: false,
        message: "משתמש לא מאומת",
      });
    }

    //  שליפת נתוני משתמש מ-firestore עפ"י uid
    let userData = null;
    try {
      const q = db.collection("users").where("UID", "==", uid);
      const querySnapshot = await q.get();
      userData = querySnapshot.docs[0].data();
    } catch (err) {}

    if (userData.job_title !== "מנהל ארגון") {
      return res.status(403).send({
        success: false,
        message: "אין לך הרשאה למחוק תיעוד",
      });
    }

    //  מחיקת התיעוד
    try {
      const financeRef = db.collection("finance");

      const querySnapshot = await financeRef.get();

      const interArr = [];
      querySnapshot.forEach((doc) => {
        interArr.push(doc.data());
      });

      querySnapshot.forEach(async (doc) => {
        if (
          doc.data().time._seconds === finance.time._seconds &&
          doc.data().time._nanoseconds === finance.time._nanoseconds
        ) {
          await doc.ref.delete().then(() => {
            res.status(200).send({
              success: true,
              message: "התיעוד נמחק בהצלחה",
            });
          });
        }
      });

    } catch (err) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן מחיקת התיעוד",
      });
    }
  });
});
