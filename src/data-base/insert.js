import { db } from "./config.js";
import { collection, addDoc } from "firebase/firestore";

const addStudent = async (student) => {
  await addDoc(collection(db, "students"), student);
};

const addUser = async (user) => {
//   const uid = await register(user.email, "123456");
  user.UID = "123456";
  await addDoc(collection(db, "users"), user);
};

const addArchive = async (archive) => {
  await addDoc(collection(db, "archive"), archive);
};

const addFinance = async (finance) => {
  await addDoc(collection(db, "finance"), finance);
};


export { addStudent, addUser, addArchive, addFinance };
