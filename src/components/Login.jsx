import classes from "../css/login.module.css";
import React, { useEffect, useRef, useState, useContext } from "react";
import { UserContext } from "../App.js";
import { login } from "../data-base/authentication.js";
import { useNavigate } from "react-router-dom";
import { findUserByUID } from "../data-base/select.js";

function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [shoeError, setShoeError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  useEffect(() => {
    document.title = "צורבא - התחברות";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userAuth = await login(
      usernameRef.current.value,
      passwordRef.current.value
    );
    if (userAuth) {
      const uid = userAuth.uid;
      setUser(await findUserByUID(uid));
      navigate("/home");
    } else {
      setShoeError(true);
    }
  };
  return (
    <div className={classes.divContainer}>
      <div className={classes.container}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <img
            className={classes.img}
            src="/assets/logo-Tzorva.png"
            alt="לוגו צורבא"
          />
          <h1 className={classes.h1}>התחברות למערכת</h1>
          <label className={classes.label} htmlFor="username">
            מייל:
          </label>
          <input
            className={classes.input}
            ref={usernameRef}
            type="text"
            id="username"
          />
          <label className={classes.label} htmlFor="password">
            סיסמא:
          </label>
          <input
            className={classes.input}
            ref={passwordRef}
            type="password"
            id="password"
          />
          {shoeError && (
            <p className={classes.p}>שם משתמש או סיסמא אינם תקינים</p>
          )}
          <button className={classes.button}>כניסה</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
