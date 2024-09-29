import db from "./config.js";
import { getDocs, collection, doc } from "firebase/firestore";

const getAllUsers = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    // console.log("Document data:", doc.data());

    arr.push(doc.data());
  });
  return arr;
};

const getUser = async (id) => {
  const docRef = doc(collection(db, "users", id));
  const document = await docRef.get();
  if (!document.exists) {
    console.log("No such document!");
  } else {
    console.log("Document data:", document.data());
  }
};

getUser("5t2C1JbaFIT6hLQO6bJb");

export { getAllUsers };
