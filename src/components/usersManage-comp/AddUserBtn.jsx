import classes from "../../css/users.module.css";
import React, { useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SnackbarMUI from "../../services/SnackbarMUI";

function AddUserBtn({ getUsers }) {
  const userIdRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cityRef = useRef();
  const phoneRef = useRef();
  const jobRef = useRef();
  const emailRef = useRef();

  const [showAddForm, setShowAddForm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      const newUser = {
        user_id: userIdRef.current.value,
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
        job_title: jobRef.current.value,
        city: cityRef.current.value,
        phone: phoneRef.current.value,
        email: emailRef.current.value,
        access_permissions: {
          actions: {
            delete_interventions: false,
            delete_student: false,
            add_student: false,
            show_docs: false,
          },
          finance: false,
          archive: false,
          users_manage: false,
          students: [],
        },
      };
      setShowAddForm(false);

      await fetch(
        `https://adduser${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            uid: u.uid,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("המשתמש נוסף בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          getUsers(u);
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
      <button
        onClick={() => setShowAddForm(true)}
        className={classes.addUserBtn}
      >
        + הוסף משתמש
      </button>
      {showAddForm && (
        <>
          <div
            className={classes.overlay}
            onClick={() => setShowAddForm(false)}
          ></div>
          <div className={classes.addUserForm}>
            <form className={classes.addUserForm} onSubmit={handleSubmit}>
              <h1 className={classes.h1}>הוספת משתמש</h1>
              <input
                className={classes.input}
                ref={userIdRef}
                type="text"
                placeholder="* תעודת זהות"
                maxLength={9}
                minLength={9}
                required
              />
              <input
                ref={firstNameRef}
                className={classes.input}
                type="text"
                placeholder="* שם פרטי"
                required
              />
              <input
                className={classes.input}
                ref={lastNameRef}
                type="text"
                placeholder="* שם משפחה"
                required
              />
              <input
                className={classes.input}
                ref={cityRef}
                type="text"
                placeholder="* עיר"
                required
              />
              <input
                className={classes.input}
                ref={phoneRef}
                type="text"
                placeholder="* טלפון"
                required
              />
              <input
                className={classes.input}
                ref={emailRef}
                type="email"
                placeholder={`* דוא"ל`}
                required
              />
              <select
                required
                defaultValue={""}
                ref={jobRef}
                name="role"
                id="role"
              >
                <option value="" disabled>
                  * -- בחר אפשרות --
                </option>
                <option value="admin">מנהל ת"ת</option>
                <option value="user">יועץ</option>
                <option value="user">מטפל</option>
              </select>

              <div className={classes.btns}>
                <button className={classes.saveBtn}>הוסף</button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={classes.cancelBtn}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {openAlert && <SnackbarMUI state={state} message={messags} />}
    </div>
  );
}

export default AddUserBtn;
