import { db } from "./config.js";
import { getDocs, collection, query, where } from "firebase/firestore";

const getAllUsers = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    // console.log("Document data:", doc.data());

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
    console.log("Document data:", userData);
    return userData;
  }
};

export { getAllUsers, findUserByUID };
