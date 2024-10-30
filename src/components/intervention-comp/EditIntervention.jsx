import classes from "../../css/intervention.module.css";
import React, { useRef, useState, useContext } from "react";
import { formatDateToHebrew } from "../../services/date";
import { updateIntervention } from "../../data-base/update";
import { UserContext } from "../../App";

function EditIntervention({ intervention, fetchData }) {
  const { user } = useContext(UserContext);
  const manager =
    user.job_title === "מנהל ארגון" ||
    user.job_title === "יועץ" ||
    user.job_title === `מנהל ת"ת`;
  const [showEditForm, setShowEditForm] = useState(false);

  const tutorRef = useRef();
  const studentRef = useRef();
  const placeRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();

  const handleEdit = (e) => {
    e.preventDefault();
    const formData = {};
    if (tutorRef.current.value !== intervention.tutor_name) {
      formData.tutor_name = tutorRef.current.value;
    }

    if (studentRef.current.value !== intervention.student_name) {
      formData.student_name = studentRef.current.value;
    }

    if (placeRef.current.value !== intervention.place) {
      formData.place = placeRef.current.value;
    }

    if (titleRef.current.value !== intervention.intervention_title) {
      formData.intervention_title = titleRef.current.value;
    }
    if (
      descriptionRef.current.value !== intervention.intervention_description
    ) {
      formData.intervention_description = descriptionRef.current.value;
    }

    updateIntervention(intervention, formData);
    fetchData();
    setShowEditForm(false);
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
                defaultValue={formatDateToHebrew(intervention.time)}
                disabled
              />
              {manager && (
                <>
                  <label htmlFor="tutor">מטפל:</label>
                  <input
                    type="text"
                    id="tutor"
                    name="tutor"
                    defaultValue={intervention.tutor_name}
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
                defaultValue={intervention.student_name}
                disabled
              />
              <label htmlFor="place">מקום מפגש:</label>
              <input
                ref={placeRef}
                type="text"
                id="place"
                name="place"
                defaultValue={intervention.place}
              />
              <label htmlFor="title">נושא טיפול:</label>
              <input
                ref={titleRef}
                type="text"
                id="title"
                name="title"
                defaultValue={intervention.intervention_title}
              />
              <label htmlFor="description">תיאור:</label>
              <textarea
                ref={descriptionRef}
                id="description"
                name="description"
                defaultValue={intervention.intervention_description}
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
    </>
  );
}

export default EditIntervention;
