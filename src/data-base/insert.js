import { db } from "./config.js";
import { collection, addDoc } from "firebase/firestore";

const addStudent = async (student) => {
  await addDoc(collection(db, "students"), student);
};

const addUser = async (user) => {
  await addDoc(collection(db, "users"), user);
};

export { addStudent, addUser };
