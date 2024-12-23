import classes from "../../css/users.module.css";
import React, { useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function EditUser({ user, setShowEditUser, getuse, setAlert }) {
  const phoneRef = useRef();
  const emailRef = useRef();
  const jobRef = useRef();
  const { setOpenAlert, setMessags, setState } = setAlert;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      const formData = {};

      if (phoneRef.current.value !== user.fathers_phone) {
        formData.phone = phoneRef.current.value;
      }

      if (emailRef.current.value !== user.email) {
        formData.email = emailRef.current.value;
      }

      if (jobRef.current.value !== user.job_title) {
        formData.job_title = jobRef.current.value;
      }

      setShowEditUser(false);

      await fetch(
        `https://edituser${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${idToken}`,
            uid: u.uid,
          },
          body: JSON.stringify({ ...formData, user_id: user.user_id }),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("פרטי המשתמש עודכנו בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          getuse(u);
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
      <form className={classes.editUserForm} onSubmit={handleSubmit}>
        <h1>עריכת פרטי משתמש</h1>
        <label htmlFor="userId">מס' זהות</label>
        <input
          className={classes.input}
          type="text"
          id="userId"
          name="userId"
          defaultValue={user.user_id}
          disabled
        />
        <label className={classes.label} htmlFor="firstName">
          שם פרטי:
        </label>
        <input
          disabled
          className={classes.input}
          type="text"
          id="firstName"
          name="firstName"
          defaultValue={user.first_name}
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
          defaultValue={user.last_name}
        />
        <label className={classes.label} htmlFor="job">
          תפקיד:
        </label>
        <select
          defaultValue={user.job_title}
          className={classes.input}
          ref={jobRef}
          name="job"
          id="job"
        >
          <option value={`מנהל ת"ת`}>מנהל ת"ת</option>
          <option value="יועץ">יועץ</option>
          <option value="מטפל">מטפל</option>
        </select>

        <label className={classes.label} htmlFor="phone">
          טלפון:
        </label>
        <input
          ref={phoneRef}
          className={classes.input}
          type="text"
          id="phone"
          name="phone"
          defaultValue={user.phone}
        />
        <label className={classes.label} htmlFor="email">
          דוא"ל:
        </label>
        <input
          ref={emailRef}
          className={classes.input}
          type="email"
          id="email"
          name="email"
          defaultValue={user.email}
        />

        <div className={classes.updateBtns}>
          <button className={classes.saveBtn}>עדכן</button>
          <button
            className={classes.cancelBtn}
            onClick={() => setShowEditUser(false)}
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
