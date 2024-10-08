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

export { updateStudent };
