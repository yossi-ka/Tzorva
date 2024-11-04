import classes from "../../css/intervention.module.css";
import React, { useRef, useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { addIntervention } from "../../data-base/insert";
import { getusers, getStudents } from "../../data-base/select";

function AddIntervention({ fetchData }) {
  const [studentsArr, setStudentsArr] = useState([]);
  const [tutorsArr, setTutorsArr] = useState([]);
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

  useEffect(() => {
    getStudents(user.UID).then((res) => {
      const students = res.map((student) => ({
        name: `${student.first_name} ${student.last_name}`,
        id: student.student_id,
      }));

      setStudentsArr(students);
    });
    getusers().then((res) => {
      const tutors = res
        .filter((user) => user.job_title === "מטפל")
        .map((user) => ({
          name: `${user.first_name} ${user.last_name}`,
          id: user.user_id,
        }));

      setTutorsArr(tutors);
    });
  }, [user.UID]);

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
        ? tutorsArr.find((tutor) => tutor.name === tutorRef.current.value).id
        : user.user_id,
      intervention_title: titleRef.current.value,
      intervention_description: descriptionRef.current.value,
      time: time,
      date: date,
      place: placeRef.current.value,
      student_id: studentsArr.find(
        (student) => student.name === studentRef.current.value
      ).id,
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
        + הוספת טיפול
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
                  <option>-- בחר מטפל --</option>
                  {tutorsArr.map((tutor, index) => (
                    <option key={index} value={tutor.name}>
                      {tutor.name}
                    </option>
                  ))}
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
              {studentsArr.map((student, index) => (
                <option key={index} value={student.name}>
                  {student.name}
                </option>
              ))}
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
