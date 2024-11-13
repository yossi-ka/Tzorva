import classes from "../../css/archive.module.css";
import React, { useRef, useState } from "react";
import { statusArr } from "./AddArchive";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SnackbarMUI from "../../services/SnackbarMUI";

function EditArchive({ archive, fetchData }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");

  const titleRef = useRef();
  const amountRef = useRef();
  const bodyRef = useRef();

  const handleEdit = (e) => {
    e.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      const formData = {};
      if (titleRef.current.value !== archive.title) {
        formData.title = titleRef.current.value;
      }

      if (amountRef.current.value !== archive.invested_amount) {
        formData.invested_amount = amountRef.current.value;
      }

      if (bodyRef.current.value !== archive.body) {
        formData.body = bodyRef.current.value;
      }
      setShowEditForm(false);
      await fetch(
        `https://editarchive${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${idToken}`,
            uid: u.uid,
          },
          body: JSON.stringify({ ...formData, student_id: archive.student_id }),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("עדכון בוצע בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          fetchData(u);
        } else {
          setMessags("עדכון נכשל, נסה שנית");
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
    <>
      <button className={classes.editBtn} onClick={() => setShowEditForm(true)}>
        📝 ערוך
      </button>

      {showEditForm && (
        <>
          <div className={classes.overlay}></div>
          <div className={classes.editForm}>
            <form onSubmit={handleEdit}>
              <h1>עריכת תיעוד</h1>
              <label htmlFor="name">שם התלמיד:</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={archive.full_name}
                disabled
              />

              <label htmlFor="title">סטטוס:</label>
              <select
                ref={titleRef}
                id="title"
                name="title"
                defaultValue={archive.title}
              >
                {statusArr.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <label htmlFor="amount">סכום:</label>
              <input
                ref={amountRef}
                type="number"
                id="amount"
                name="amount"
                defaultValue={archive.invested_amount}
              />

              <label htmlFor="body">תיאור:</label>
              <input
                ref={bodyRef}
                type="text"
                id="body"
                name="body"
                defaultValue={archive.body}
              />
              <div className={classes.lastBtns}>
                <button className={classes.saveBtn}>שמור</button>
                <button
                  className={classes.cancelBtn}
                  onClick={() => setShowEditForm(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {openAlert && <SnackbarMUI state={state} message={messags} />}
    </>
  );
}

export default EditArchive;
