
/*
פונקציות POST לעריכת נתונים ב-Firestore
על מנת לערוך ולתקן, יש לבצע את השלבים הבאים:
1. להעביר את הפונקציה/ות לקובץ index.js הנמצא בתיקיית tzorva-functions
2. לנווט בטרמינל לתיקיית tzorva-functions
3. להזין את הפקודה npx eslint . --fix
4. להזין את הפקודה firebase deploy --only functions
   אם רוצים פונקציה בודדת ניתן להזין firebase deploy --only functions:<function> עם שם הפונקציה
*/


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

//  פונקציה לעדכון תלמיד
export const editStudent = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const student = req.body;

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
            message: "אין לך הרשאה לערוך תלמידים",
          });
          return resolve();
        }

        //  עדכון התלמיד

        let querySnapshot1 = await db.collection("students").get();

        if (querySnapshot1.empty) {
          return res.status(403).json({
            success: false,
            message: "לא נמצאו תלמידים לעדכון",
          });
        }

        querySnapshot1.docs.forEach((doc) => {
          if (doc.data().student_id === student.student_id) {
            db.collection("students").doc(doc.id).update(student);
          }
        });

        res.status(200).json({
          success: true,
          message: "התלמיד עודכן בהצלחה",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בעריכת התלמיד",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});

//  פונקציה לעריכת פיננסים
export const editFinance = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const finDetails = req.body;

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

        if (userData.job_title !== "מנהל ארגון") {
          res.status(403).json({
            success: false,
            message: "אין לך הרשאה לערוך פיננסים",
          });
          return resolve();
        }

        //  עדכון הפעולה

        await db
          .collection("finance")
          .get()
          .then((qs) => {
            qs.forEach((doc) => {
              if (
                (doc.data().time._seconds === finDetails.time._seconds &&
                  doc.data().time._nanoseconds ===
                    finDetails.time._nanoseconds) ||
                doc.data().time === finDetails.time ||
                (doc.data().time.seconds === finDetails.time.seconds &&
                  doc.data().time.nanoseconds === finDetails.time.nanoseconds)
              ) {
                db.collection("finance").doc(doc.id).update(finDetails);
                res.status(200).json({
                  success: true,
                  message: "הפעולה עודכנה בהצלחה",
                });
              }
            });
          });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בעריכת הפעולה",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});

//  פונקציה לעריכת ארכיון
export const editArchive = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const archiveDetails = req.body;

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

        if (userData.job_title !== "מנהל ארגון") {
          res.status(403).json({
            success: false,
            message: "אין לך הרשאה לערוך ארכיון",
          });
          return resolve();
        }

        //  עדכון הפעולה

        await db
          .collection("archive")
          .get()
          .then((qs) => {
            qs.forEach((doc) => {
              if (
                (doc.data().time._seconds === archiveDetails.time._seconds &&
                  doc.data().time._nanoseconds ===
                    archiveDetails.time._nanoseconds) ||
                doc.data().time === archiveDetails.time ||
                (doc.data().time.seconds === archiveDetails.time.seconds &&
                  doc.data().time.nanoseconds ===
                    archiveDetails.time.nanoseconds)
              ) {
                db.collection("archive").doc(doc.id).update(archiveDetails);
                res.status(200).json({
                  success: true,
                  message: "הפעולה עודכנה בהצלחה",
                });
              }
            });
          });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בעריכת הפעולה",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});

//  פונקציה לעריכת טיפול
export const editIntervention = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const interventionDetails = req.body;

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

        //  בדיקת הרשאות
        if (
          userData.job_title !== "מנהל ארגון" &&
          userData.job_title !== "יועץ" &&
          userData.job_title !== 'מנהל ת"ת' &&
          (userData.access_permissions.students.includes(
            interventionDetails.student_id
          ) === false ||
            interventionDetails.tutor_id !== userData.user_id)
        ) {
          res.status(403).json({
            success: false,
            message: "אין לך הרשאה לערוך טיפול",
          });
          return resolve();
        }

        //  עדכון הפעולה

        await db
          .collection("interventions")
          .get()
          .then((qs) => {
            qs.forEach((doc) => {
              if (
                (doc.data().time._seconds ===
                  interventionDetails.time._seconds &&
                  doc.data().time._nanoseconds ===
                    interventionDetails.time._nanoseconds) ||
                doc.data().time === interventionDetails.time ||
                (doc.data().time.seconds === interventionDetails.time.seconds &&
                  doc.data().time.nanoseconds ===
                    interventionDetails.time.nanoseconds)
              ) {
                db.collection("interventions")
                  .doc(doc.id)
                  .update(interventionDetails);
                res.status(200).json({
                  success: true,
                  message: "הפעולה עודכנה בהצלחה",
                });
              }
            });
          });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בעריכת הפעולה",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});
