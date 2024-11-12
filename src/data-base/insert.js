/*
פונקציות POST להוספת נתונים ל-Firestore
על מנת לערוך ולתקן, יש לבצע את השלבים הבאים:
1. להעביר את הפונקציה/ות לקובץ index.js הנמצא בתיקיית tzorva-functions
2. לנווט בטרמינל לתיקיית tzorva-functions
3. להזין את הפקודה npx eslint . --fix
4. להזין את הפקודה firebase deploy --only functions
   אם רוצים פונקציה בודדת ניתן להזין firebase deploy --only functions:<function> עם שם הפונקציה
*/

import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";

// Initialize Firebase Admin
admin.initializeApp();
const db = getFirestore();

// // הגדרת CORS middleware
const corsHandler = cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "uid"],
});

// פונקציה להוספת תלמיד
export const addStudent = onRequest(async (req, res) => {
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
            message: "אין לך הרשאה להוסיף תלמידים",
          });
          return resolve();
        }

        // הוספת התלמיד
        await db.collection("students").add(student);

        res.status(200).json({
          success: true,
          message: "התלמיד נוסף בהצלחה",
        });
        return resolve();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בהוספת תלמיד",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});

// פונקציה להוספת משתמש
export const addUser = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const userToAdd = req.body;

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
            message: "אין לך הרשאה להוסיף משתמשים",
          });
          return resolve();
        }

        // הוספת המשתמש
        await db.collection("users").add(userToAdd);

        res.status(200).json({
          success: true,
          message: "המשתמש נוסף בהצלחה",
        });
        return resolve();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בהוספת משתמש",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});

// // פונקציה להוספה לארכיון
export const addArchive = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const newArchive = req.body;

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
            message: "אין לך הרשאה להוסיף תיעודים",
          });
          return resolve();
        }

        // הוספה לארכיון
        await db.collection("archive").add(newArchive);

        res.status(200).json({
          success: true,
          message: "השורה נוספה בהצלחה",
        });
        return resolve();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בהוספה לארכיון",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});

// פונקציה תיעוד פיננסים
export const addFinance = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const newFinance = req.body;

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
            message: "אין לך הרשאה להוסיף פעולות פיננסיות",
          });
          return resolve();
        }

        // הוספה לפיננסים
        await db.collection("finance").add(newFinance);

        res.status(200).json({
          success: true,
          message: "השורה נוספה בהצלחה",
        });
        return resolve();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בהוספה לפיננסים",
          error: error.message,
        });
        return resolve();
      }
    });
  });
});

// פונקציה להוספת טיפול
export const addIntervention = onRequest(async (req, res) => {
  // עטיפת כל הלוגיקה ב-Promise
  return new Promise((resolve) => {
    corsHandler(req, res, async () => {
      try {
        const uid = req.headers.uid;
        const authHeader = req.headers.authorization;
        const newIntervention = req.body;

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

        if (
          userData.job_title === "מטפל" &&
          userData.user_id !== newIntervention.tutor_id
        ) {
          res.status(403).json({
            success: false,
            message: "אין לך הרשאה להוסיף טיפולים של מטפלים אחרים",
          });
          return resolve();
        }

        // הוספת הטיפול
        await db.collection("interventions").add(newIntervention);

        res.status(200).json({
          success: true,
          message: "הטיפול נוסף בהצלחה",
        });
        return resolve();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "שגיאה בהוספת הטיפול",
          error: error.message,
        });
        return resolve();
      }
    });
  });
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
        message.from = {
          id: userData.user_id,
          name: userData.first_name + " " + userData.last_name,
        };
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