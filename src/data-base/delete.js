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

export { deleteStudent, deleteUser, deleteFinance };
