import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./config.js"; // ייבוא האפליקציה שיצרנו קודם

const auth = getAuth(app); // עכשיו משתמשים במופע האפליקציה

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

export { login };
