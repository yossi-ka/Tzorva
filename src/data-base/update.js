import { db } from "./config.js";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

const updateStudent = async (student, updatedData) => {
  try {
    const q = query(
      collection(db, "students"),
      where("student_id", "==", student.student_id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // בדיקה אם יש מסמכים
      await updateDoc(querySnapshot.docs[0].ref, updatedData);
    } else {
      console.log("לא נמצא תלמיד עם המזהה הזה.");
      // טיפול במקרה שלא נמצא תלמיד
    }
  } catch (error) {
    console.error("שגיאה בעדכון התלמיד:", error);
    // טיפול בשגיאות
  }
};

const updateUser = async (user, updatedData) => {
  try {
    const q = query(
      collection(db, "users"),
      where("user_id", "==", user.user_id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // בדיקה אם יש מסמכים
      await updateDoc(querySnapshot.docs[0].ref, updatedData);
    } else {
      console.log("לא נמצא משתמש עם המזהה הזה.");
      // טיפול במקרה שלא נמצא משתמש
    }
  } catch (error) {
    console.error("שגיאה בעדכון משתמש:", error);
    // טיפול בשגיאות
  }
};

const updateFinance = async (finance, updatedData) => {
  try {
    const q = query(
      collection(db, "finance"),
      where("time", "==", finance.time)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // בדיקה אם יש מסמכים
      await updateDoc(querySnapshot.docs[0].ref, updatedData);
    } else {
      console.log("לא נמצאה פעולה עם חותמת זמן זו.");
      // טיפול במקרה שלא נמצא מסמך
    }
  } catch (error) {
    console.error("שגיאה בעדכון פעולה:", error);
    // טיפול בשגיאות
  }
};

const updateArchive = async (archive, updatedData) => {
  try {
    const q = query(
      collection(db, "archive"),
      where("student_id", "==", archive.student_id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // בדיקה אם יש מסמכים
      await updateDoc(querySnapshot.docs[0].ref, updatedData);
    } else {
      console.log("לא נמצא התיעוד המבוקש.");
      // טיפול במקרה שלא נמצא מסמך
    }
  } catch (error) {
    console.error("שגיאה בעדכון התיעוד:", error);
    // טיפול בשגיאות
  }
};

const updateIntervention = async (intervention, updatedData) => {
  try {
    const q = query(
      collection(db, "interventions"),
      where("time", "==", intervention.time)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // בדיקה אם יש מסמכים
      await updateDoc(querySnapshot.docs[0].ref, updatedData);
    } else {
      console.log("לא נמצא טיפול עם חותמת זמן זו.");
      // טיפול במקרה שלא נמצא מסמך
    }
  } catch (error) {
    console.error("שגיאה בעדכון הטיפול:", error);
    // טיפול בשגיאות
  }
};

export {
  updateStudent,
  updateUser,
  updateFinance,
  updateArchive,
  updateIntervention,
};
