import { db } from "./config.js";
import { collection, addDoc } from "firebase/firestore";

const addStudent = async (student) => {
  await addDoc(collection(db, "students"), student);
};

const addUser = async (user) => {
  await addDoc(collection(db, "users"), user);
};

const addArchive = async (archive) => {
  await addDoc(collection(db, "archive"), archive);
};

export { addStudent, addUser, addArchive };
