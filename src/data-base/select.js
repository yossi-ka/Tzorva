import { db } from "./config.js";
import { getDocs, collection, query, where } from "firebase/firestore";

const getAllUsers = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const findUserByUID = async (uid) => {
  const q = query(collection(db, "users"), where("UID", "==", uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No such document!");
    return null;
  } else {
    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = { id: doc.id, ...doc.data() };
    });
    return userData;
  }
};

const getAllStudents = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "students"));
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const getStudents = async (uid) => {
  const allStudents = await getAllStudents();
  try {
    const user = await findUserByUID(uid);
    if (user.job_title === "מנהל") {
      return allStudents;
    } else {
      const students = [];
      const studArr = user["access permissions"]?.students || [];
      studArr.forEach((id) => {
        const student = allStudents.find(
          (student) => student.student_id === id
        );
        if (student) {
          students.push(student);
        }
      });
      return students;
    }
  } catch (e) {
    return [];
  }
};

export { getAllUsers, findUserByUID, getStudents };
