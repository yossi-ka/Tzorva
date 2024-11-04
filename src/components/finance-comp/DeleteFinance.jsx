import classes from "../../css/finance.module.css";
import React, { useState } from "react";
import { deleteFinance } from "../../data-base/delete";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function DeleteFinance({ finance, fetchData }) {
  const [showWarningForm, setShowWarningForm] = useState(false);
  const handleDeleteFinance = async (finance) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      setShowWarningForm(false);
      await deleteFinance(finance);
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
