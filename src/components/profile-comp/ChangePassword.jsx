import classes from "../../css/profile.module.css";
import React, { useRef, useState, useContext } from "react";
import { UserContext } from "../../App";
import {
  updateUserPassword,
  getCurrentPassword,
} from "../../data-base/authentication";

function ChangePassword({ setChangePassword }) {
  const { user } = useContext(UserContext);
  const [showDifferentPasswords, setShowDifferentPasswords] = useState(false);
  const [showError, setShowError] = useState(false);
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPasswordRef.current.value !== confirmPasswordRef.current.value) {
      setShowDifferentPasswords(true);
      return;
    }
    const isCurrentPasswordValid = await getCurrentPassword(
      user.email,
      oldPasswordRef.current.value
    );
    if (isCurrentPasswordValid) {
      await updateUserPassword(newPasswordRef.current.value);
      setChangePassword(false);
    } else {
      setShowError(true);
    }
  };
  return (
    <div className={classes.fixed}>
      <div
        onClick={() => setChangePassword(false)}
        className={classes.underlay}
      ></div>
      <form onSubmit={handleSubmit} className={classes.formUpdatePassword}>
        <h1 className={classes.title}>שינוי סיסמה</h1>
        <label htmlFor="oldPassword">הזן סיסמה ישנה:</label>
        <input
          ref={oldPasswordRef}
          required
          type="password"
          id="oldPassword"
          name="oldPassword"
        />
        {showError && <p className={classes.error}>הסיסמה אינה תקינה</p>}
        <label htmlFor="newPassword">הזן סיסמה חדשה: (מינימום 6 תווים)</label>
        <input
          minLength={6}
          ref={newPasswordRef}
          required
          type="password"
          id="newPassword"
          name="newPassword"
        />
        <label htmlFor="confirmPassword">
          אימות סיסמה חדשה: (מינימום 6 תווים)
        </label>
        <input
          minLength={6}
          ref={confirmPasswordRef}
          required
          type="password"
          id="confirmPassword"
          name="confirmPassword"
        />
        {showDifferentPasswords && (
          <p className={classes.error}>הסיסמאות אינן תואמות, נסה שוב</p>
        )}
        <div className={classes.divBtns}>
          <button className={classes.button}>שמור סיסמה</button>
          <button
            className={classes.button}
            onClick={() => setChangePassword(false)}
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
