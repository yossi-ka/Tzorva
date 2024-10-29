import classes from "../../css/archive.module.css";
import React, { useState } from "react";
import { deleteArchive } from "../../data-base/delete";

function DeleteArchive({ archive, fetchData }) {
  const [showWarningForm, setShowWarningForm] = useState(false);
  const handleDeleteArchive = async (archive) => {
    setShowWarningForm(false);
    await deleteArchive(archive);
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
