import classes from "../css/login.module.css";
import React, { useRef, useState } from "react";
import { login } from "../data-base/authontication.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [shoeError, setShoeError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(
      usernameRef.current.value,
      passwordRef.current.value
    );
    if (user) {
      console.log(user.uid);
      navigate("/home");
    } else {
      setShoeError(true);
    }
  };
  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <img className={classes.img} src="/assets/logo-Tzorva.png" alt="לוגו צורבא" />
        <h1 className={classes.h1}>התחברות למערכת</h1>
        <label className={classes.label} htmlFor="username">שם משתמש:</label>
        <input className={classes.input} ref={usernameRef} type="text" id="username" />
        <label className={classes.label} htmlFor="password">סיסמא:</label>
        <input className={classes.input} ref={passwordRef} type="password" id="password" />
        {shoeError && <p className={classes.p}>שם משתמש או סיסמא אינם תקינים</p>}
        <button className={classes.button}>כניסה</button>
      </form>
    </div>
  );
}

export default Login;
