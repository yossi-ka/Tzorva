import classes from "../css/profile.module.css";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./profile-comp/ChangePassword";
import EditProfile from "./profile-comp/EditProfile";

function Profile() {
  const navigate = useNavigate();
  const [updateProfile, setUpdateProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const { user } = useContext(UserContext);
  useEffect(() => {
    document.title = "פרופיל משתמש";
  });
  useEffect(() => {
    if (updateProfile || changePassword) {
      // הוספת מחלקה בעת הצורך
      document
        .querySelector(`.${classes.container}`)
        .classList.add(classes.disabled);
    } else {
      // הסרת מחלקה בעת הצורך
      document
        .querySelector(`.${classes.container}`)
        .classList.remove(classes.disabled);
    }
  }, [updateProfile, changePassword]);

  return (
    <>
      <div
        className={`${classes.container} ${
          updateProfile || changePassword ? classes.disabled : ""
        }`}
      >
        <h1 className={classes.title}>פרופיל משתמש</h1>
        <p className={classes.info}>
          שם משתמש: {user.first_name + " " + user.last_name}
        </p>
        <p className={classes.info}>תפקיד: {user.job_title}</p>
        <p className={classes.info}>
          {`דוא"ל: `}
          <span dir="ltr">{user.email}</span>
        </p>
        <p className={classes.info}>טלפון: {user.phone}</p>
        <div className={classes.buttons}>
          <button
            onClick={() => {
              setUpdateProfile(true);
            }}
            className={classes.button}
          >
            📝 ערוך פרטים
          </button>
          <button
            onClick={() => setChangePassword(true)}
            className={classes.button}
          >
            🔑 שנה סיסמא
          </button>
          <button className={classes.button} onClick={() => navigate(-1)}>
            חזרה
          </button>
        </div>
      </div>
      {updateProfile && (
        <div className={`${classes.updateProfile} ${classes.optionsProfile}`}>
          <EditProfile setUpdateProfile={setUpdateProfile} />
        </div>
      )}

      {changePassword && (
        <div className={`${classes.changePassword} ${classes.optionsProfile}`}>
          <ChangePassword setChangePassword={setChangePassword} />
        </div>
      )}
    </>
  );
}

export default Profile;
