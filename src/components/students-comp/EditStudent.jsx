import classes from "../../css/student.module.css";
import React, { useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function EditStudent({ student, setShowEditStudent, getstud, setAlert }) {
  const fathersPhoneRef = useRef();
  const cityOfSchoolRef = useRef();
  const classRef = useRef();
  const urgencyRef = useRef();

  const { setOpenAlert, setMessags, setState } = setAlert;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      const formData = {};

      if (fathersPhoneRef.current.value !== student.fathers_phone) {
        formData.fathers_phone = fathersPhoneRef.current.value;
      }

      if (cityOfSchoolRef.current.value !== student.city_of_school) {
        formData.city_of_school = cityOfSchoolRef.current.value;
      }

      if (classRef.current.value !== student.class_school) {
        formData.class_school = classRef.current.value;
      }

      if (urgencyRef.current.value !== student.urgency) {
        formData.urgency_level = urgencyRef.current.value;
      }
      formData.student_id = student.student_id;
      setShowEditStudent(false);

      await fetch(
        `https://editstudent${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            uid: u.uid,
            authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("פרטי התלמיד עודכנו בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          getstud();
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
    <div>
      <form className={classes.editStudentForm} onSubmit={handleSubmit}>
        <h1>עריכת פרטי תלמיד</h1>
        <label className={classes.label} htmlFor="firstName">
          שם פרטי:
        </label>
        <input
          disabled
          className={classes.input}
          type="text"
          id="firstName"
          name="firstName"
          defaultValue={student.first_name}
        />
        <label className={classes.label} htmlFor="lastName">
          שם משפחה:
        </label>
        <input
          disabled
          className={classes.input}
          type="text"
          id="lastName"
          name="lastName"
          defaultValue={student.last_name}
        />
        <label className={classes.label} htmlFor="fathersPhone">
          טלפון האב:
        </label>
        <input
          ref={fathersPhoneRef}
          className={classes.input}
          type="text"
          id="fathersPhone"
          name="fathersPhone"
          defaultValue={student.fathers_phone}
        />
        <label className={classes.label} htmlFor="city">
          עיר:
        </label>
        <select
          ref={cityOfSchoolRef}
          className={classes.input}
          type="text"
          id="city"
          name="city"
          defaultValue={student.city_of_school}
        >
          <option value="אלעד">אלעד</option>
          <option value="אשדוד">אשדוד</option>
          <option value="בני ברק">בני ברק</option>
          <option value="שאר ערים">שאר ערים</option>
        </select>
        <label className={classes.label} htmlFor="class">
          כיתה:
        </label>
        <select
          ref={classRef}
          className={classes.input}
          type="text"
          id="class"
          name="class"
          defaultValue={student.class_school}
        >
          <option value="גן">גן</option>
          <option value="מכינה">מכינה</option>
          <option value="א">א</option>
          <option value="ב">ב</option>
          <option value="ג">ג</option>
          <option value="ד">ד</option>
          <option value="ה">ה</option>
          <option value="ו">ו</option>
          <option value="ז">ז</option>
          <option value="ח">ח</option>
          <option value="ט">ט</option>
        </select>
        <label className={classes.label} htmlFor="urgency">
          סטטוס דחיפות:
        </label>
        <select
          ref={urgencyRef}
          className={classes.select}
          name="urgency"
          id="urgency"
          defaultValue={student.urgency_level}
        >
          <option value="גבוה">גבוה</option>
          <option value="בינוני">בינוני</option>
          <option value="נמוך">נמוך</option>
        </select>
        <div className={classes.updateBtns}>
          <button className={classes.saveBtn}>עדכן</button>
          <button
            className={classes.cancelBtn}
            onClick={() => setShowEditStudent(false)}
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;
