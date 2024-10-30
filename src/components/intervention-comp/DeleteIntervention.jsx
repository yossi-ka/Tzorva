import classes from "../../css/intervention.module.css";
import React, { useState } from "react";
import { deleteIntervention } from "../../data-base/delete";

function DeleteIntervention({ intervention, fetchData }) {
  
  
  const [showWarningForm, setShowWarningForm] = useState(false);
  const handleDeleteIntervention = async (intervention) => {
    setShowWarningForm(false);
    await deleteIntervention(intervention);
    fetchData();
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
