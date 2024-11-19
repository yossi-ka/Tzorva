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
  allowedHeaders: ["Content-Type", "Authorization", "uid", "student_id"],
});

// פונקציה לקבלת מסמכים
export const getDocuments = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const studentId = req.headers.student_id;

    if (!studentId) {
      return res.status(400).send({
        success: false,
        message: "studentId חסר בבקשה",
      });
    }

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
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "משתמש לא ידוע",
      });
    }

    if (userData.job_title === "מטפל") {
      return res.status(403).send({
        success: false,
        message: "אין הרשאה לקבלת מסמכים",
      });
    }

    //  שליפת המסמכים
    try {
      const q = db.collection("students").where("student_id", "==", studentId);

      const qs = await q.get();
      if (qs.empty) {
        return res.status(404).send({
          success: false,
          message: "לא נמצא תלמיד עם studentId זה",
        });
      }

      const studentData = qs.docs[0]?.data();
      if (!studentData) {
        return res.status(404).send({
          success: false,
          message: "לא נמצא מידע לתלמיד",
        });
      }
      res.status(200).send({
        success: true,
        message: studentData.documents,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
        error: error.message,
      });
    }
  });
});
