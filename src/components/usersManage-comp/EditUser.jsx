import classes from "../../css/users.module.css";
import React, { useRef } from "react";
import { updateUser } from "../../data-base/update";

function EditUser({ user, setShowEditUser, getuse }) {
  const phoneRef = useRef();
  const emailRef = useRef();
  const jobRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
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

    await updateUser(user, formData);
    setShowEditUser(false);
    getuse();
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
        <input
          className={classes.input}
          ref={jobRef}
          jobName={classes.input}
          type="text"
          id="job"
          name="job"
          defaultValue={user.job_title}
        />
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
