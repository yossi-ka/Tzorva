import classes from "../../css/intervention.module.css";
import React, { useRef, useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import SnackbarMUI from "../../services/SnackbarMUI";

function AddIntervention({ fetchData }) {
  const [studentsArr, setStudentsArr] = useState([]);
  const [tutorsArr, setTutorsArr] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");
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
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      const dataStudent = await fetch(
        `https://getstudents${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "GET",
          headers: {
            uid: u.uid,
            authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { message } = await dataStudent.json();

      const students = message?.map((student) => ({
        name: `${student.first_name} ${student.last_name}`,
        id: student.student_id,
      }));
      setStudentsArr(students);

      if (manager) {
        const dataTutors = await fetch(
          `https://gettutors${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
          {
            method: "GET",
            headers: {
              uid: u.uid,
              authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const { message } = await dataTutors.json();
        const tutors = message
          ?.filter((user) => user.job_title === "מטפל")
          .map((user) => ({
            name: `${user.first_name} ${user.last_name}`,
            id: user.user_id,
          }));

        setTutorsArr(tutors);
      }
    });
  }, [user.UID, manager]);

  const handleAddIntervention = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      const selectedDate = new Date(dateRef.current.value);

      // Create Firestore Timestamp objects
      const time = Timestamp.now();
      const date = Timestamp.fromDate(selectedDate);

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
        time,
        date,
        place: placeRef.current.value,
        student_id: studentsArr.find(
          (student) => student.name === studentRef.current.value
        ).id,
      };
      setOpenForm(false);

      await fetch(
        `https://addintervention${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            uid: u.uid,
            authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newIntervention),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("הטיפול נוסף בהצלחה");
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
                  {tutorsArr?.map((tutor, index) => (
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
      {openAlert && <SnackbarMUI state={state} message={messags} />}
    </>
  );
}

export default AddIntervention;
