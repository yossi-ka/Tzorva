import classes from "../../css/intervention.module.css";
import React, { useState } from "react";
// import { deleteIntervention } from "../../data-base/delete";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function DeleteIntervention({ intervention, fetchData }) {
  const [showWarningForm, setShowWarningForm] = useState(false);
  const handleDeleteIntervention = async (inter) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      const data = await fetch(
        "https://deleteintervention-cjqo4fyw5a-uc.a.run.app",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
            uid: u.uid,
          },
          // credentials: "include",
          body: JSON.stringify(inter),
        }
      );
      const { message } = await data.json();

      // await deleteIntervention(intervention);
      setShowWarningForm(false);
      fetchData(u);
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
                onClick={() => handleDeleteIntervention(intervention)}
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

export default DeleteIntervention;
