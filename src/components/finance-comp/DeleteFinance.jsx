import classes from "../../css/finance.module.css";
import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function DeleteFinance({ finance, fetchData }) {
  const [showWarningForm, setShowWarningForm] = useState(false);
  const handleDeleteFinance = async (fin) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      const data = await fetch(
        `https://deletefinance${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
            uid: u.uid,
          },
          body: JSON.stringify(fin),
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
                onClick={() => handleDeleteFinance(finance)}
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

export default DeleteFinance;
