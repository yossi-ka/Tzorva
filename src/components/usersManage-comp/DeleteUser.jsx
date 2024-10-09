import classes from "../../css/users.module.css";
import React, { useRef, useState } from "react";
import { deleteUser } from "../../data-base/delete";

function DeleteUser({ user, getuse, setShowDeleteForm }) {
  const handleDeleteUser = async () => {
    setShowDeleteForm(false);
    await deleteUser(user);
    getuse();
  };

  return (
    <>
    <div className={classes.overlaySure}></div>
    <div className={classes.warning}>
      <h1 className={classes.h1Warning}>האם אתה בטוח?</h1>
      <div className={classes.lastBtns}>
        <button
          className={classes.deleteUserBtn}
          onClick={handleDeleteUser}
        >
          מחק
        </button>
        <button
          className={classes.cancelBtn}
          onClick={() => setShowDeleteForm(false)}
        >
          ביטול
        </button>
      </div>
    </div>
  </>
  );
}

export default DeleteUser;
