import classes from "../../css/intervention.module.css";
import React, { useRef, useState, useContext } from "react";
import { UserContext } from "../../App";
import { addIntervention } from "../../data-base/insert";

const tutorsArr = ["משה פינקלשטיין", "111111111", "יוסף ברגר", "123123123"];
const studentsArr = [
  "מאיר דוד טובאק",
  "121212121",
  "אברהם ניסן ניימן",
  "456456456",
];

function AddIntervention({ fetchData }) {
  const { user } = useContext(UserContext);
  const manager =
    user.job_title === "מנהל ארגון" ||
    user.job_title === "יועץ" ||
    user.job_title === `מנהל ת"ת`;
  const tutorRef = useRef(null);
  const dateRef = useRef(null);
  const placeRef = useRef(null);
  const studentRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const [openForm, setOpenForm] = useState(false);
  const handleAddIntervention = async (e) => {
    e.preventDefault();
    const time = new Date();
    const date = new Date(dateRef.current.value + "T00:00:00.000Z");

    const newIntervention = {
      student_name: studentRef.current.value,
      tutor_name: manager
        ? tutorRef.current.value
        : user.first_name + " " + user.last_name,
      tutor_id: manager
        ? Array.from(tutorsArr).indexOf(tutorRef.current.value)
        : user.user_id,
        intervention_title: titleRef.current.value,
      intervention_description: descriptionRef.current.value,
      time: time,
      date: date,
      place: placeRef.current.value,
    };

    await addIntervention(newIntervention);
    fetchData();
    setOpenForm(false);
  };

  return (
    <>
      <button
        className={classes.addInterventionBtn}
        onClick={() => setOpenForm(true)}
      >
        + הוספת שורה
      </button>
      {openForm && (
        <>
          <div
            className={classes.overlayAdd}
            onClick={() => setOpenForm(false)}
          ></div>
          <form
            onSubmit={handleAddIntervention}
            className={classes.addInterventionForm}
          >
            <h1 className={classes.title}>הוספת טיפול</h1>
            <label htmlFor="date">תאריך טיפול:</label>
            <input type="date" id="date" name="date" ref={dateRef} required />

            {manager && (
              <>
                <label htmlFor="tutor">מטפל</label>
                <select
                  required
                  defaultValue=""
                  name="tutor"
                  id="tutor"
                  ref={tutorRef}
                >
                  <option value="" disabled>
                    -- בחר מטפל --
                  </option>
                  {tutorsArr.map(
                    (tutor, index) =>
                      index % 2 === 0 && (
                        <option key={tutor} value={tutor}>
                          {tutor}
                        </option>
                      )
                  )}
                </select>
              </>
            )}
            <label htmlFor="student">תלמיד:</label>
            <select
              required
              defaultValue=""
              name="student"
              id="student"
              ref={studentRef}
            >
              <option value="" disabled>
                -- בחר תלמיד --
              </option>
              {studentsArr.map(
                (student, index) =>
                  index % 2 === 0 && (
                    <option key={student} value={student}>
                      {student}
                    </option>
                  )
              )}
            </select>
            <label htmlFor="place">מקום מפגש:</label>
            <input
              type="text"
              id="place"
              name="place"
              ref={placeRef}
              required
            />
            <label htmlFor="title">נושא טיפול:</label>
            <input
              type="text"
              id="title"
              name="title"
              ref={titleRef}
              required
            />
            <label htmlFor="description">פרטי התקדמות:</label>
            <textarea
              type="text"
              id="description"
              name="description"
              ref={descriptionRef}
              required
            />
            <button>הוספה</button>
          </form>
        </>
      )}
    </>
  );
}

export default AddIntervention;
