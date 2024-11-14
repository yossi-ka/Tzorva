import classes from "../../css/treatment.module.css";
import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SnackbarMUI from "../../services/SnackbarMUI";

function DeleteTreatment({ intervention, fetchData }) {
  const [showWarningForm, setShowWarningForm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");
  const handleDeleteTreatment = async (treat) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      setShowWarningForm(false);

      await fetch(
        `https://deleteintervention${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
            uid: u.uid,
          },
          body: JSON.stringify(treat),
        }
      ).then(async (res) => {
        if (res.ok) {
          setMessags("הטיפול נמחק בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          fetchData(u);
        } else {
          setMessags("שגיאה, אנא נסה שוב");
          setState("error");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
        }
      });
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
                onClick={() => handleDeleteTreatment(intervention)}
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
      {openAlert && <SnackbarMUI state={state} message={messags} />}
    </div>
  );
}

export default DeleteTreatment;
