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

// פונקציה למחיקת מסמך
export const deleteDocument = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const url = req.body.url;

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

    if (userData.job_title === "מטפל") {
      return res.status(403).send({
        success: false,
        message: "אין לך הרשאה למחוק מסמכים",
      });
    }

    //  מחיקת המסמך
    try {
      const studentsQuery = await db.collection("students").get();

      const matchingStudentDoc = studentsQuery.docs.find((doc) =>
        doc.data().documents.some((document) => document.URL === url)
      );

      if (!matchingStudentDoc) {
        return res.status(404).send({
          success: false,
          message: "מסמך לא נמצא",
        });
      }

      // לקחת את המסמך הראשון (אמור להיות יחיד)
      const studentDoc = studentsQuery.docs[0];
      const studentData = studentDoc.data();

      // סינון המערך להסרת המסמך הספציפי
      const updatedDocuments = studentData.documents.filter(
        (doc) => doc.URL !== url
      );

      // עדכון המסמך עם המערך המעודכן
      await db
        .collection("students")
        .doc(studentDoc.id)
        .update({ documents: updatedDocuments });

      res.status(200).send({
        success: true,
        message: "המסמך נמחק בהצלחה",
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן מחיקת המסמך",
      });
    }
  });
});
