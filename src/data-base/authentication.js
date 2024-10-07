import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
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

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("שגיאה במהלך ניתוק המשתמש:", error);
  }
};

const getCurrentUser = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user); // אם יש משתמש, העבר אותו חזרה דרך ה-callback
    } else {
      callback(null); // אם אין משתמש, העבר null
    }
  });
};

const getCurrentPassword = async (email, currentPassword) => {
  try {
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    // אימות מחדש הצליח, ניתן להמשיך בתהליך שינוי הסיסמה
    return true;
  } catch (error) {
    console.error("שגיאה במהלך אימות מחדש:", error);
    // אימות מחדש נכשל, הצג הודעת שגיאה למשתמש
    return false;
  }
};

const updateUserPassword = async (newPassword) => {
  try {
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error("שגיאה במהלך עדכון הסיסמא:", error);
  }
};

export {
  login,
  logout,
  updateUserPassword,
  getCurrentPassword,
  getCurrentUser,
};
