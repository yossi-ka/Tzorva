import classes from "../../css/archive.module.css";
import React, { useState } from "react";
// import { deleteArchive } from "../../data-base/delete";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function DeleteArchive({ archive, fetchData }) {
  const [showWarningForm, setShowWarningForm] = useState(false);
  const handleDeleteArchive = async (arch) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      await fetch(
        `https://deletearchive${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
            uid: u.uid,
          },
          body: JSON.stringify(arch),
        }
      )
        .then((res) => res.json())
        .then((d) => {
          console.log(d.message);
          fetchData(u);
        });

      setShowWarningForm(false);
    });
  };

  return (
    <div className={classes.warningForm}>
      <button
        className={classes.deleteBtn}
        onClick={() => setShowWarningForm(true)}
      >
        🗑️ מחק
      </button>
      {showWarningForm && (
        <>
          <div className={classes.underlay}></div>
          <div className={classes.warning}>
            <h1>האם אתה בטוח?</h1>
            <div className={classes.deleteBtns}>
              <button
                className={classes.deleteBtn}
                onClick={() => handleDeleteArchive(archive)}
              >
                מחק
              </button>
              <button
                className={classes.cancelBtn}
                onClick={() => setShowWarningForm(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DeleteArchive;
