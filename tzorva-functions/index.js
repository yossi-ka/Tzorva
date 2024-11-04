import admin from "firebase-admin"; // ייבוא firebase-admin
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import cors from "cors"; // ייבוא CORS
import { log } from "firebase-functions/logger";

// Initialize Firebase Admin
admin.initializeApp(); // השתמש ב-admin.initializeApp
const db = getFirestore();

// הגדרת CORS
const corsOptions = { origin: true };
const corsMiddleware = cors(corsOptions);

// פונקציה לקבלת כל המשתמשים - הושלם
export const getAllUsers = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const uid = req.headers.uid;
    const authHeader = req.headers.authorization;

    console.log("****uid: ", req.headers.uid);
    console.log("****authHeader: ", req.headers.authorization);

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
      console.error("Error verifying ID token:", error);
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
      console.log("****user data: ", querySnapshot.docs[0].data());
      userData = querySnapshot.docs[0].data();
    } catch (err) {
      console.log("****user data not found: ", err);
    }

    if (userData.job_title !== "מנהל ארגון") {
      console.log("****job_title: ", userData.job_title);

      return res.status(403).send({
        success: false,
        massage: "אין הרשאה לקבלת פרטי משתמשים",
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
        massage: arr,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        massage: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לקבלת התלמידים - הושלם
export const getStudents = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
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
      console.error("Error verifying ID token:", error);
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
      console.log("****user data: ", querySnapshot.docs[0].data());
      userData = querySnapshot.docs[0].data();
    } catch (err) {
      console.log("****user data not found: ", err);
    }

    try {
      if (
        userData.job_title === "מנהל ארגון" ||
        userData.job_title === "יועץ"
      ) {
        const querySnapshot = await db.collection("students").get();
        const arr = querySnapshot.docs.map((doc) => doc.data()); // שימוש ב-map כדי לקבל את הנתונים
        res.status(200).send({
          success: true,
          massage: arr,
        });
      } else if (userData.job_title === "מנהל ת\"ת") {
        const city = userData.city;

        const q = db.collection("students").where("city_of_school", "==", city);
        const querySnapshot2 = await q.get();
        const arr = querySnapshot2.docs.map((doc) => doc.data());
        res.status(200).send({
          success: true,
          massage: arr,
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
          massage: arr,
        });
      } else {
        res.status(403).send({
          success: false,
          message: "לא ניתן לקבל רשימת תלמידים, נא פנה למנהל המערכת",
        });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).send({
        success: false,
        message: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לקבלת מידע פיננסי - הושלם
export const getFinance = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
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
      console.log("משתמש לא ידוע: ", err);
    }

    if (userData.job_title !== "מנהל ארגון") {
      console.log("****job_title: ", userData.job_title);

      return res.status(403).send({
        success: false,
        massage: "אין הרשאה לקבלת נתונים פיננסיים",
      });
    }

    //  שליפת נתוני פיננסים
    const arr = [];
    try {
      const querySnapshot = await db.collection("finance").get();
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      res.status(200).send({
        success: true,
        massage: arr,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        massage: "שגיאה בזמן שליפת המידע",
      });
    }
  });
});

// פונקציה לחיפוש משתמש לפי UID
export const findUserByUID = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const uid = req.query.uid;
    const q = db.collection("users").where("UID", "==", uid);
    const querySnapshot = await q.get();
    if (querySnapshot.empty) {
      return res.status(404).send("No such document!");
    } else {
      let userData = null;
      querySnapshot.forEach((doc) => {
        userData = { id: doc.id, ...doc.data() };
      });
      res.status(200).send(userData);
    }
  });
});

// פונקציה לקבלת מידע פיננסי - הושלם
export const getArchive = functions.https.onRequest((req, res) => {
    corsMiddleware(req, res, async () => {
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
        console.log("משתמש לא ידוע: ", err);
      }
  
      if (userData.job_title !== "מנהל ארגון") {
        console.log("****job_title: ", userData.job_title);
  
        return res.status(403).send({
          success: false,
          massage: "אין הרשאה לקבלת נתוני ארכיון",
        });
      }
  
      //  שליפת נתוני ארכיון
      const arr = [];
      try {
        const querySnapshot = await db.collection("archive").get();
        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        res.status(200).send({
          success: true,
          massage: arr,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          massage: "שגיאה בזמן שליפת המידע",
        });
      }
    });
  });

// פונקציה לקבלת כל ההתערבויות
export const getAllInterventions = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const arr = [];
    try {
      const querySnapshot = await db.collection("interventions").get();
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      res.status(200).send(arr);
    } catch (error) {
      res.status(500).send("Error retrieving interventions data");
    }
  });
});

// פונקציה לקבלת התערבויות לפי תלמיד
export const getInterventionsByStudent = functions.https.onRequest(
  (req, res) => {
    corsMiddleware(req, res, async () => {
      const studentId = req.query.student_id;
      const arr = [];

      try {
        const q = db
          .collection("interventions")
          .where("student_id", "==", studentId);
        const querySnapshot = await q.get();
        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        res.status(200).send(arr);
      } catch (error) {
        res.status(500).send("לא ניתן לספק את הבקשה");
      }
    });
  }
);

// פונקציה לקבלת התערבויות לפי מדריך
export const getInterventionsByTutor = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const tutorId = req.query.tutor_id;
    const arr = [];

    try {
      const q = db.collection("interventions").where("tutor_id", "==", tutorId);
      const querySnapshot = await q.get();
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      res.status(200).send(arr);
    } catch (error) {
      res.status(500).send("Error retrieving interventions for the tutor");
    }
  });
});

// פונקציה לקבלת התערבויות לפי עיר
export const getInterventionsByCity = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const city = req.query.city;
    const arr = [];

    try {
      const allStudents = await getAllStudents();
      const filteredStudents = allStudents.filter(
        (student) => student.city_of_school === city
      );
      const interventionsArr = await getAllInterventions();

      filteredStudents.forEach((student) => {
        const studentInterventions = interventionsArr.filter(
          (intervention) => intervention.student_id === student.student_id
        );
        arr.push(...studentInterventions);
      });

      res.status(200).send(arr);
    } catch (error) {
      res.status(500).send("Error retrieving interventions by city");
    }
  });
});
