import { db } from "./config.js";
import { collection, addDoc } from "firebase/firestore";

const addStudent = async (student) => {
  const docRef = await addDoc(collection(db, "students"), student);
  console.log("Document written with ID: ", docRef.id);
};

export { addStudent };
