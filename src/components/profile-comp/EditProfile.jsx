import classes from "../../css/profile.module.css";
import React, { useContext, useRef } from "react";
import { UserContext } from "../../App";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function EditProfile({ setUpdateProfile, handleAlert }) {
  const { user, setUser } = useContext(UserContext);
  const phoneRef = useRef();
  const emailRef = useRef();

  const { setOpenAlert, setMessage, setState } = handleAlert;

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      const newProfile = {
        phone: phoneRef.current.value,
        email: emailRef.current.value,
      };
      if (
        phoneRef.current.value === user.phone &&
        emailRef.current.value === user.email
      ) {
        setUpdateProfile(false);
        return;
      }
      setUpdateProfile(false);
      await fetch(
        `https://editprofile${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${idToken}`,
            uid: u.uid,
          },
          body: JSON.stringify(newProfile),
        }
      ).then((res) => {
        if (res.ok) {
          setUpdateProfile(false);
          setMessage("הפרטים עודכנו בהצלחה");
          setState("success");
          setOpenAlert(true);
          setUser((prev) => ({ ...prev, ...newProfile }));
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
        }
      });
    });
  };

  return (
    <div className={classes.fixed}>
      <div className={classes.underlay}></div>

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
          ref={phoneRef}
          required
          type="text"
          id="phone"
          name="phone"
          defaultValue={user.phone}
        />
        <label htmlFor="email">דוא"ל:</label>
        <input
          ref={emailRef}
          dir="ltr"
          required
          type="email"
          id="email"
          name="email"
          defaultValue={user.email}
        />
        <div className={classes.divBtns}>
          <button className={classes.button}>שמור</button>
          <button className={classes.button}>ביטול</button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
