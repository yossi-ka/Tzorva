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
      console.error("אין לך הרשאה למחוק את המסמך.");
    } else {
      console.error("שגיאה במחיקת המסמך:", error);
    }
  }
};

export { deleteStudent };
