import classes from "../../css/users.module.css";
import React, { useRef, useState } from "react";
import { addUser } from "../../data-base/insert";

function AddUserBtn({ getUsers }) {
  const userIdRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phoneRef = useRef();
  const jobRef = useRef();
  const emailRef = useRef();

  const [showAddForm, setShowAddForm] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const newUser = {
      user_id: userIdRef.current.value,
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      job_title: jobRef.current.value,
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      access_permissions: {
        actions: {
          delete_treatments: false,
          delete_student: false,
          add_student: false,
        },
        finance: false,
        archive: false,
        users_manage: false,
        students: [],
      },
    };
    addUser(newUser);
    getUsers();
    setShowAddForm(false);
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
                placeholder="תעודת זהות"
                required
              />
              <input
                ref={firstNameRef}
                className={classes.input}
                type="text"
                placeholder="שם פרטי"
                required
              />
              <input
                className={classes.input}
                ref={lastNameRef}
                type="text"
                placeholder="שם משפחה"
                required
              />
              <input
                className={classes.input}
                ref={emailRef}
                type="email"
                placeholder={`דוא"ל`}
                required
              />
              <input
                className={classes.input}
                ref={phoneRef}
                type="text"
                placeholder="טלפון"
                required
              />
              <input
                className={classes.input}
                ref={jobRef}
                type="text"
                placeholder="תפקיד"
                required
              />
              <div className={classes.btns}>
                <button className={classes.saveBtn}>שמירה</button>
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
    </div>
  );
}

export default AddUserBtn;
