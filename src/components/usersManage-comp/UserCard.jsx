import classes from "../../css/users.module.css";
import React, { useState } from "react";
import DeleteUser from "./DeleteUser";
import EditUser from "./EditUser";
import UpdatePermissions from "./UpdatePermissions";

function UserCard({ user, getuse }) {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showUpdatePermissions, setShowUpdatePermissions] = useState(false);

  return user?.job_title === "מנהל ארגון" ? (
    ""
  ) : (
    <div className={classes.userCard}>
      <div className={classes.basicDetails}>
        <h1 className={classes.h1}>{`${user.first_name} ${user.last_name}`}</h1>
        <p className={classes.p}>{user.city}</p>
        <p>{`תפקיד: ${user.job_title}`}</p>
        <button
          className={`${classes.moreBtn} ${
            showMoreDetails ? classes.rotated : ""
          }`}
          onClick={() => setShowMoreDetails(!showMoreDetails)}
        >
          <span className="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </div>

      {showMoreDetails && (
        <div className={classes.moreDetails}>
          <p className={classes.p}>{`מס' זהות: ${user.user_id}`}</p>
          <p className={classes.p}>{`מספר טלפון: ${user.phone}`}</p>
          <p className={classes.p}>{`דוא"ל: ${user.email}`}</p>
          <div className={classes.btns}>
            <button
              className={classes.editUserBtn}
              onClick={() => setShowEditUser(true)}
            >
              📝 ערוך
            </button>
            <button
              className={classes.updatePermissionsBtn}
              onClick={() => setShowUpdatePermissions(true)}
            >
              עדכן הרשאות
            </button>
            <button
              className={classes.deleteUserBtn}
              onClick={() => setShowDeleteWarning(true)}
            >
              🗑️ הסר
            </button>
          </div>
        </div>
      )}
      {showDeleteWarning && (
        <>
          <div className={classes.overlaySure}></div>
          <div className={classes.deleteUserArea}>
            <DeleteUser
              user={user}
              getuse={getuse}
              setShowDeleteForm={setShowDeleteWarning}
            />
          </div>
        </>
      )}
      {showEditUser && (
        <>
          <div
            className={classes.overlay}
            onClick={() => setShowEditUser(false)}
          ></div>
          <div className={classes.editUserArea}>
            <EditUser
              user={user}
              getuse={getuse}
              setShowEditUser={setShowEditUser}
            />
          </div>
        </>
      )}
      {showUpdatePermissions && (
        <>
          <div
            className={classes.overlay}
            onClick={() => setShowUpdatePermissions(false)}
          ></div>
          <div className={classes.updatePermissionsArea}>
            <UpdatePermissions
              setShowUpdatePermissions={setShowUpdatePermissions}
              user={user}
              getuse={getuse}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default UserCard;
