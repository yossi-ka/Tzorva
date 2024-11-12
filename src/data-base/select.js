/*
פונקציות GET לשליפת נתונים מ-Firestore
על מנת לערוך ולתקן, יש לבצע את השלבים הבאים:
1. להעביר את הפונקציה/ות לקובץ index.js הנמצא בתיקיית tzorva-functions
2. לנווט בטרמינל לתיקיית tzorva-functions
3. להזין את הפקודה npx eslint . --fix
4. להזין את הפקודה firebase deploy --only functions
   אם רוצים פונקציה בודדת ניתן להזין firebase deploy --only functions:<function> עם שם הפונקציה
*/

import admin from "firebase-admin"; // ייבוא firebase-admin
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import cors from "cors"; // ייבוא CORS

// Initialize Firebase Admin
admin.initializeApp();
const db = getFirestore();

// הגדרת CORS
const corsOptions = { origin: true };
const corsHandler = cors(corsOptions);

// פונקציה לקבלת כל המשתמשים
export const getUsers = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;

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
        message: "אין הרשאה לקבלת פרטי משתמשים",
      });
    }

    // שליפת נתוני המשתמשים
    try {
      const arr = [];
      const querySnapshot = await db.collection("users").get();
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      res.status(200).send({
        success: true,
        message: arr,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לקבלת התלמידים
export const getStudents = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;

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

    //  שליפת נתוני המשתמשים
    try {
      if (
        userData.job_title === "מנהל ארגון" ||
        userData.job_title === "יועץ"
      ) {
        const querySnapshot = await db.collection("students").get();
        const arr = querySnapshot.docs.map((doc) => doc.data()); // שימוש ב-map כדי לקבל את הנתונים
        res.status(200).send({
          success: true,
          message: arr,
        });
      } else if (userData.job_title === 'מנהל ת"ת') {
        const city = userData.city;

        const q = db.collection("students").where("city_of_school", "==", city);
        const querySnapshot2 = await q.get();
        const arr = querySnapshot2.docs.map((doc) => doc.data());
        res.status(200).send({
          success: true,
          message: arr,
        });
      } else if (userData.job_title === "מטפל") {
        const studentList = userData.access_permissions.students;
        const q = db
          .collection("students")
          .where("student_id", "in", studentList);
        const querySnapshot2 = await q.get();
        const arr = querySnapshot2.docs.map((doc) => doc.data());
        res.status(200).send({
          success: true,
          message: arr,
        });
      } else {
        res.status(403).send({
          success: false,
          message: "לא ניתן לקבל רשימת תלמידים, נא פנה למנהל המערכת",
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לקבלת מידע פיננסי
export const getFinance = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;

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

    if (userData.job_title !== "מנהל ארגון") {
      return res.status(403).send({
        success: false,
        message: "אין הרשאה לקבלת נתונים פיננסיים",
      });
    }

    //  שליפת נתוני פיננסים
    const arr = [];
    try {
      const querySnapshot = await db.collection("finance").get();
      querySnapshot.forEach((doc) => {
        const dataWithId = { ...doc.data(), id: doc.id };
        arr.push(dataWithId);
      });
      res.status(200).send({
        success: true,
        message: arr,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לקבלת נתוני ארכיון
export const getArchive = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;

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

    if (userData.job_title !== "מנהל ארגון") {
      return res.status(403).send({
        success: false,
        message: "אין הרשאה לקבלת נתוני ארכיון",
      });
    }

    //  שליפת נתוני ארכיון
    const arr = [];
    try {
      const querySnapshot = await db.collection("archive").get();
      querySnapshot.forEach((doc) => {
        const dataWithId = { ...doc.data(), id: doc.id };
        arr.push(dataWithId);
      });
      res.status(200).send({
        success: true,
        message: arr,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לקבלת רשימת הטיפולים
export const getInterventions = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const rest = req.headers.rest;

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

    //  שליפת טיפולים
    try {
      const arr = [];
      if (rest) {
        //  שליפת טיפולים
        const q = db
          .collection("interventions")
          .where("student_id", "==", rest);
        const querySnapshot = await q.get();
        querySnapshot.forEach((doc) => {
          const dataWithId = { ...doc.data(), id: doc.id };
          arr.push(dataWithId);
        });

        // שליפת נתוני תלמיד
        const querySnapshot1 = db
          .collection("students")
          .where("student_id", "==", rest);
        const querySnapshot2 = await querySnapshot1.get();
        const studentData = querySnapshot2.docs[0].data();

        if (
          userData.job_title === "יועץ" ||
          userData.job_title === "מנהל ארגון"
        ) {
          res.status(200).send({
            success: true,
            message: arr,
          });
        } else if (userData.job_title === 'מנהל ת"ת') {
          if (studentData.city_of_school === userData.city) {
            res.status(200).send({
              success: true,
              message: arr,
            });
          } else {
            res.status(403).send({
              success: false,
              message: "אין לך הרשאה לקבל טיפולים",
            });
          }
        } else if (userData.job_title === "מטפל") {
          if (userData.students.includes(rest)) {
            res.status(200).send({
              success: true,
              message: arr,
            });
          } else {
            res.status(403).send({
              success: false,
              message: "אין לך הרשאה לקבל טיפולים",
            });
          }
        } else {
          res.status(403).send({
            success: false,
            message: "משתמש לא ידוע",
          });
        }
      } else {
        if (
          userData.job_title === "מנהל ארגון" ||
          userData.job_title === "יועץ"
        ) {
          const querySnapshot = await db.collection("interventions").get();
          querySnapshot.forEach((doc) => {
            const dataWithId = { ...doc.data(), id: doc.id };
            arr.push(dataWithId);
          });
          res.status(200).send({
            success: true,
            message: arr,
          });
        } else if (userData.job_title === 'מנהל ת"ת') {
          const studentIdArr = [];
          const querySnapshot1 = await db
            .collection("students")
            .where("city_of_school", "==", userData.city)
            .get();
          querySnapshot1.forEach((doc) => {
            const dataWithId = { ...doc.data(), id: doc.id };
            studentIdArr.push(dataWithId.student_id);
          });

          const querySnapshot2 = await db
            .collection("interventions")
            .where("student_id", "in", studentIdArr)
            .get();
          querySnapshot2.forEach((doc) => {
            const dataWithId = { ...doc.data(), id: doc.id };
            arr.push(dataWithId);
          });
          res.status(200).send({
            success: true,
            message: arr,
          });
        } else if (userData.job_title === "מטפל") {
          const querySnapshot = await db
            .collection("interventions")
            .where("student_id", "in", userData.access_permissions.students)
            .get();
          querySnapshot.forEach((doc) => {
            const dataWithId = { ...doc.data(), id: doc.id };
            arr.push(dataWithId);
          });
          res.status(200).send({
            success: true,
            message: arr,
          });
        } else {
          res.status(403).send({
            success: false,
            message: "לא ניתן לקבל רשימת טיפולים, נא פנה למנהל המערכת",
          });
        }
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לקבלת משתמש עפ"י uid
export const getUserByUid = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;

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
      return res.status(200).send({
        success: true,
        message: userData,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

//  פונקציה לקבלת רשימת המטפלים
export const getTutors = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;
    const rest = req.headers.rest;

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
        message: "אין הרשאה לקבל רשימת מטפלים",
      });
    }

    try {
      const usersCollection = db
        .collection("users")
        .where("job_title", "==", "מטפל");
      const usersSnapshot = await usersCollection.get();
      const users = usersSnapshot.docs.map((doc) => doc.data());
      res.status(200).send({
        success: true,
        message: users,
      });
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לקבלת הודעות
export const getMessages = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;

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

    //  שליפת ההודעות
    try {
      // שאילתא לקבלת הודעות שנשלחו מהמשתמש
      const QuerySnapshot1 = db
        .collection("messages")
        .where("from.id", "==", userData.user_id);

      // שאילתא לקבלת הודעות שנשלחו למשתמש
      const QuerySnapshot2 = db
        .collection("messages")
        .where("to.id", "==", userData.user_id);

      const fromQuerySnapshot = await QuerySnapshot1.get();
      const toQuerySnapshot = await QuerySnapshot2.get();

      // מיזוג תוצאות משתי השאילתות
      const messages = [
        ...fromQuerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        ...toQuerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      ];

      res.status(200).send({
        success: true,
        message: messages,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});
