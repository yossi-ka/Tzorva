/*
פונקציות DELETE למחיקת נתונים ל-Firestore
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

// פונקציה למחיקת תלמיד
export const deleteStudent = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const studentToDelete = req.body;

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

    if (userData.job_title !== "מנהל ארגון" && userData.job_title !== "יועץ") {
      return res.status(403).send({
        success: false,
        message: "אין לך הרשאה למחוק תלמיד",
      });
    }

    //  מחיקת התלמיד
    try {
      const studentRef = db.collection("students");

      const querySnapshot = await studentRef.get();

      const interArr = [];
      querySnapshot.forEach((doc) => {
        interArr.push(doc.data());
      });

      querySnapshot.forEach(async (doc) => {
        if (doc.data().student_id === studentToDelete.student_id) {
          await doc.ref.delete().then(() => {
            res.status(200).send({
              success: true,
              message: "התלמיד נמחק בהצלחה",
            });
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן מחיקת התלמיד",
      });
    }
  });
});

// פונקציה למחיקת משתמש
export const deleteUser = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const userToDelete = req.body;

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
        message: "אין לך הרשאה למחוק משתמש",
      });
    }

    //  מחיקת המשתמש
    try {
      const userRef = db.collection("users");

      const querySnapshot = await userRef.get();

      const interArr = [];
      querySnapshot.forEach((doc) => {
        interArr.push(doc.data());
      });

      querySnapshot.forEach(async (doc) => {
        if (doc.data().user_id === userToDelete.user_id) {
          await doc.ref.delete().then(() => {
            res.status(200).send({
              success: true,
              message: "המשתמש נמחק בהצלחה",
            });
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן מחיקת המשתמש",
      });
    }
  });
});

// פונקציה למחיקת תיעוד פיננסי
export const deleteFinance = onRequest((req, res) => {
  corsHandler(req, res, async () => {
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
      const financeId = finance.id;

      await db
        .collection("finance")
        .doc(financeId)
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
        message: "שגיאה בזמן מחיקת התיעוד",
      });
    }
  });
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

// פונקציה למחיקת תיעוד ארכיון
export const deleteArchive = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const archive = req.body;

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
      const archiveRef = db.collection("archive");

      const querySnapshot = await archiveRef.get();

      const interArr = [];
      querySnapshot.forEach((doc) => {
        interArr.push(doc.data());
      });

      querySnapshot.forEach(async (doc) => {
        if (doc.data().student_id === archive.student_id) {
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
