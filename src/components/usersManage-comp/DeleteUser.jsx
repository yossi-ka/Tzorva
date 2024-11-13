import classes from "../../css/users.module.css";
import React from "react";
// import { deleteUser } from "../../data-base/delete";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function DeleteUser({ user, getuse, setShowDeleteForm, setAlert }) {
  const { setOpenAlert, setMessags, setState } = setAlert;

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      fetch(
        `https://deleteuser${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            uid: u.uid,
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(user),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("המשתמש נמחק בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          getuse(u);
        } else {
          setMessags("שגיאה, אנא נסה שוב");
          setState("error");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
        }
      });

      setShowDeleteForm(false);
      // await deleteUser(user);
    });
  };

  return (
    <div className={classes.warning}>
      <h1 className={classes.h1Warning}>האם אתה בטוח?</h1>
      <div className={classes.lastBtns}>
        <button className={classes.deleteUserBtn} onClick={handleDeleteUser}>
          מחק
        </button>
        <button
          className={classes.cancelBtn}
          onClick={() => setShowDeleteForm(false)}
        >
          ביטול
        </button>
      </div>
    </div>
  );
}

export default DeleteUser;
