import classes from "../../css/users.module.css";
import React, { useState } from "react";

function UserCard({ user }) {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  return (
    <div className={classes.userCard}>
      <h1 className={classes.h1}>{`${user.first_name} ${user.last_name}`}</h1>
      <p className={classes.p}>{`תפקיד: ${user.job_title}`}</p>
      <button
        className={`${classes.moreBtn} ${showMoreDetails ? classes.rotated : ''}`}
        onClick={() => setShowMoreDetails(!showMoreDetails)}
      >
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </button>

      {showMoreDetails && (
        <div className={classes.moreDetails}>
          <p className={classes.p}>{`מס' זהות: ${user.user_id}`}</p>
          <p className={classes.p}>{`מספר טלפון: ${user.phone}`}</p>
          <p className={classes.p}>{`דוא"ל: ${user.email}`}</p>
          <div className={classes.btns}>
            <button className={classes.editUserBtn}>📝 ערוך</button>
            <button className={classes.deleteUserBtn}>🗑️ הסר</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserCard;
