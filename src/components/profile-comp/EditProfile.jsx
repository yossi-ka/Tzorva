import classes from "../../css/profile.module.css";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../App";

function EditProfile({ setUpdateProfile }) {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit} className={classes.formUpdatePassword}>
      <h1 className={classes.title}>עריכת פרטים אישיים</h1>
      <label htmlFor="firstName">שם פרטי:</label>
      <input
        required
        type="text"
        id="firstName"
        name="firstName"
        defaultValue={user.first_name}
        disabled
      />
      <label htmlFor="lastName">שם משפחה:</label>
      <input
        required
        type="text"
        id="lastName"
        name="lastName"
        defaultValue={user.last_name}
        disabled
      />
      <label htmlFor="jobTitle">תפקיד:</label>
      <input
        required
        type="text"
        id="jobTitle"
        name="jobTitle"
        defaultValue={user.job_title}
        disabled
      />
      <label htmlFor="phone">טלפון:</label>
      <input
        required
        type="text"
        id="phone"
        name="phone"
        defaultValue={user.phone}
      />
      <label htmlFor="email">דוא"ל:</label>
      <input
        dir="ltr"
        required
        type="email"
        id="email"
        name="email"
        defaultValue={user.email}
      />
      <div className={classes.divBtns}>
        <button
          onClick={() => {
            setUpdateProfile(false);
          }}
          className={classes.button}
        >
          שמור
        </button>
        <button
          className={classes.button}
          onClick={() => {
            setUpdateProfile(false);
          }}
        >
          ביטול
        </button>
      </div>
    </form>
  );
}

export default EditProfile;
