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

// פונקציה למחיקת טיפול
export const deleteIntervention = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const intervention = req.body;

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
        message: "אין לך הרשאה למחוק טיפול",
      });
    }

    //  מחיקת הטיפול
    try {
      const interventionId = intervention.id;

      await db
        .collection("interventions")
        .doc(interventionId)
        .delete()
        .then(() => {
          res.status(200).send({
            success: true,
            message: "התיעוד נמחק בהצלחה",
          });
        });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן מחיקת הטיפול",
      });
    }
  });
});
