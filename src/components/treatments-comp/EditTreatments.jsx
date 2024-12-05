import classes from "../../css/treatment.module.css";
import React, { useRef, useState, useContext } from "react";
import { formatDateToHebrew } from "../../services/date";
import { UserContext } from "../../App";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SnackbarMUI from "../../services/SnackbarMUI";

function EditTreatment({ treatment, fetchData }) {
  
  const { user } = useContext(UserContext);
  const manager =
    user.job_title === "מנהל ארגון" ||
    user.job_title === "יועץ" ||
    user.job_title === `מנהל ת"ת`;
  const [showEditForm, setShowEditForm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");

  const tutorRef = useRef();
  const studentRef = useRef();
  const placeRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();

  const handleEdit = (e) => {
    e.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      const formData = {};
      if (manager && tutorRef.current.value !== treatment.tutor_name) {
        formData.tutor_name = tutorRef.current.value;
      }

      if (studentRef.current.value !== treatment.student_name) {
        formData.student_name = studentRef.current.value;
      }

      if (placeRef.current.value !== treatment.place) {
        formData.place = placeRef.current.value;
      }

      if (titleRef.current.value !== treatment.intervention_title) {
        formData.treatment_title = titleRef.current.value;
      }
      if (
        descriptionRef.current.value !== treatment.intervention_description
      ) {
        formData.intervention_description = descriptionRef.current.value;
      }
      setShowEditForm(false);

      await fetch(
        `https://editintervention${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${idToken}`,
            uid: u.uid,
          },
          body: JSON.stringify({ ...formData, id: treatment.id }),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("הטיפול עודכן בהצלחה");
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
    <>
      <button className={classes.editBtn} onClick={() => setShowEditForm(true)}>
        📝 ערוך
      </button>

      {showEditForm && (
        <>
          <div className={classes.overlay}></div>
          <div className={classes.editForm}>
            <form onSubmit={handleEdit}>
              <h1>עריכת טיפול</h1>
              <label htmlFor="date">תאריך:</label>
              <input
                type="text"
                id="date"
                name="date"
                defaultValue={formatDateToHebrew(treatment.time)}
                disabled
              />
              {manager && (
                <>
                  <label htmlFor="tutor">מטפל:</label>
                  <input
                    type="text"
                    id="tutor"
                    name="tutor"
                    defaultValue={treatment.tutor_name}
                    ref={tutorRef}
                    disabled
                  />
                </>
              )}
              <label htmlFor="student">תלמיד:</label>
              <input
                ref={studentRef}
                type="text"
                id="student"
                name="student"
                defaultValue={treatment.student_name}
                disabled
              />
              <label htmlFor="place">מקום מפגש:</label>
              <input
                ref={placeRef}
                type="text"
                id="place"
                name="place"
                defaultValue={treatment.place}
              />
              <label htmlFor="title">נושא טיפול:</label>
              <input
                ref={titleRef}
                type="text"
                id="title"
                name="title"
                defaultValue={treatment.intervention_title}
              />
              <label htmlFor="description">תיאור:</label>
              <textarea
                ref={descriptionRef}
                id="description"
                name="description"
                defaultValue={treatment.intervention_description}
              />

              <div className={classes.lastBtns}>
                <button className={classes.saveBtn}>שמור</button>
                <button
                  className={classes.cancelBtn}
                  onClick={() => setShowEditForm(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {openAlert && <SnackbarMUI state={state} message={messags} />}
    </>
  );
}

export default EditTreatment;
