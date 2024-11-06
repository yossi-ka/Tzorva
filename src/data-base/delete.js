import { db } from "./config.js";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const deleteStudent = async (student) => {
  try {
    const q = query(
      collection(db, "students"),
      where("student_id", "==", student.student_id)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(docSnap.ref);
    });
  } catch (error) {
    if (error.code === "permission-denied") {
      console.error("אין לך הרשאה למחוק את התלמיד.");
    } else {
      console.error("שגיאה במחיקת התלמיד:", error);
    }
  }
};

const deleteUser = async (user) => {
  try {
    const q = query(
      collection(db, "users"),
      where("user_id", "==", user.user_id)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(docSnap.ref);
    });
  } catch (error) {
    if (error.code === "permission-denied") {
      console.error("אין לך הרשאה למחוק את המשתמש.");
    } else {
      console.error("שגיאה במחיקת המשתמש:", error);
    }
  }
};

const deleteFinance = async (finance) => {
  console.log("deleteFinance", finance);

  try {
    const q = query(
      collection(db, "finance"),
      where("time", "==", finance.time)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(docSnap.ref);
    });
  } catch (error) {
    if (error.code === "permission-denied") {
      console.error("אין לך הרשאה למחוק את הפעולה.");
    } else {
      console.error("שגיאה במחיקת הפעולה:", error);
    }
  }
};

// פונקציה למחיקת טיפול
// export const deleteIntervention = functions.https.onRequest((req, res) => {
//   corsMiddleware(req, res, async () => {
//     const uid = req.headers.uid;
//     const authHeader = req.headers.authorization;
//     const intervention = req.body;

//     if (!uid)
//       return res.status(403).send({
//         success: false,
//         message: "לא נשלח אימות uid בבקשה",
//       });

//     if (!authHeader)
//       return res.status(403).send({
//         success: false,
//         message: "לא נשלח אימות Token בבקשה",
//       });

//     const idToken =
//       authHeader && authHeader.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : null;

//     let user;
//     try {
//       user = await admin.auth().verifyIdToken(idToken);
//     } catch (error) {
//       return res.status(401).send({
//         success: false,
//         message: "שגיאה באימות ה-ID Token",
//       });
//     }
//     const uidFromIdtoken = user.uid;
//     if (uid !== uidFromIdtoken) {
//       return res.status(403).send({
//         success: false,
//         message: "משתמש לא מאומת",
//       });
//     }

//     //  שליפת נתוני משתמש מ-firestore עפ"י uid
//     let userData = null;
//     try {
//       const q = db.collection("users").where("UID", "==", uid);
//       const querySnapshot = await q.get();
//       userData = querySnapshot.docs[0].data();
//     } catch (err) {}

//     if (userData.job_title !== "מנהל ארגון") {
//       return res.status(403).send({
//         success: false,
//         message: "אין לך הרשאה למחוק טיפול",
//       });
//     }

//     //  מחיקת הטיפול
//     try {
//       const interventionRef = db.collection("interventions");

//       const querySnapshot = await interventionRef.get();

//       const interArr = [];
//       querySnapshot.forEach((doc) => {
//         interArr.push(doc.data());
//       });

//       querySnapshot.forEach(async (doc) => {
//         if (
//           doc.data().time._seconds === intervention.time._seconds &&
//           doc.data().time._nanoseconds === intervention.time._nanoseconds
//         ) {
//           await doc.ref.delete().then(() => {
//             res.status(200).send({
//               success: true,
//               message: "הטיפול נמחק בהצלחה",
//             });
//           });
//         }
//       });

//     } catch (err) {
//       res.status(500).send({
//         success: false,
//         message: "שגיאה בזמן מחיקת הטיפול",
//       });
//     }
//   });
// });

// פונקציה למחיקת תיעוד ארכיון
// export const deleteArchive = functions.https.onRequest((req, res) => {
//   corsMiddleware(req, res, async () => {
//     const uid = req.headers.uid;
//     const authHeader = req.headers.authorization;
//     const archive = req.body;

//     if (!uid)
//       return res.status(403).send({
//         success: false,
//         message: "לא נשלח אימות uid בבקשה",
//       });

//     if (!authHeader)
//       return res.status(403).send({
//         success: false,
//         message: "לא נשלח אימות Token בבקשה",
//       });

//     const idToken =
//       authHeader && authHeader.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : null;

//     let user;
//     try {
//       user = await admin.auth().verifyIdToken(idToken);
//     } catch (error) {
//       return res.status(401).send({
//         success: false,
//         message: "שגיאה באימות ה-ID Token",
//       });
//     }
//     const uidFromIdtoken = user.uid;
//     if (uid !== uidFromIdtoken) {
//       return res.status(403).send({
//         success: false,
//         message: "משתמש לא מאומת",
//       });
//     }

//     //  שליפת נתוני משתמש מ-firestore עפ"י uid
//     let userData = null;
//     try {
//       const q = db.collection("users").where("UID", "==", uid);
//       const querySnapshot = await q.get();
//       userData = querySnapshot.docs[0].data();
//     } catch (err) {}

//     if (userData.job_title !== "מנהל ארגון") {
//       return res.status(403).send({
//         success: false,
//         message: "אין לך הרשאה למחוק תיעוד",
//       });
//     }

//     //  מחיקת התיעוד
//     try {
//       const archiveRef = db.collection("archive");

//       const querySnapshot = await archiveRef.get();

//       const interArr = [];
//       querySnapshot.forEach((doc) => {
//         interArr.push(doc.data());
//       });

//       querySnapshot.forEach(async (doc) => {
//         if (
//           doc.data().time._seconds === archive.time._seconds &&
//           doc.data().time._nanoseconds === archive.time._nanoseconds
//         ) {
//           await doc.ref.delete().then(() => {
//             res.status(200).send({
//               success: true,
//               message: "התיעוד נמחק בהצלחה",
//             });
//           });
//         }
//       });

//     } catch (err) {
//       res.status(500).send({
//         success: false,
//         message: "שגיאה בזמן מחיקת התיעוד",
//       });
//     }
//   });
// });

export { deleteStudent, deleteUser, deleteFinance };
