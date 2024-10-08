import classes from "../../css/usersManage.module.css";
import React, { useState } from "react";

function UserCard({ user }) {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  return (
    <div className={classes.userCard}>
      <h1>{`${user.first_name} ${user.last_name}`}</h1>
      <p>{`תפקיד: ${user.job_title}`}</p>
      <button
        className={classes.moreBtn}
        onClick={() => setShowMoreDetails(!showMoreDetails)}
      >
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </button>

      {showMoreDetails && (
        <div className={classes.moreDetails}>
          <p>{`מס' זהות: ${user.user_id}`}</p>
          <p>{`מספר טלפון: ${user.phone}`}</p>
          <p>{`דוא"ל: ${user.email}`}</p>
          <div className={classes.btns}>
            <button className={classes.editBtn}>📝 ערוך</button>
            <button className={classes.deleteBtn}>🗑️ הסר</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserCard;
