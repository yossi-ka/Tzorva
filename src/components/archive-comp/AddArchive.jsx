import classes from "../../css/archive.module.css";
import React, { useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SnackbarMUI from "../../services/SnackbarMUI";

export const statusArr = ["עלה לישיבה", "הסתיים טיפול", "אחר"];

function AddArchive({ fetchData }) {
  const idRef = useRef(null);
  const nameRef = useRef(null);
  const amountRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const fathersNameRef = useRef(null);
  const [openForm, setOpenForm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");

  const handleAddArchive = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      const date = new Date();
      const newArchive = {
        title: titleRef.current.value,
        student_id: idRef.current.value,
        full_name: nameRef.current.value,
        fathers_name: fathersNameRef.current.value,
        invested_amount: amountRef.current.value,
        body: bodyRef.current.value,
        time: date,
      };

      setOpenForm(false);

      await fetch(
        `https://addarchive${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            uid: u.uid,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newArchive),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("התיעוד נוסף בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          fetchData(u);
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
    <>
      <button
        className={classes.addArchiveBtn}
        onClick={() => setOpenForm(true)}
      >
        + הוספת שורה
      </button>
      {openForm && (
        <>
          <div
            className={classes.overlay}
            onClick={() => setOpenForm(false)}
          ></div>
          <form onSubmit={handleAddArchive} className={classes.addArchiveForm}>
            <h1 className={classes.h1}>הוספת תיעוד באופן ידני</h1>
            <label htmlFor="student_id">* תעודת זהות</label>
            <input
              ref={idRef}
              type="text"
              maxLength={9}
              name="student_id"
              id="student_id"
              required
            />

            <label htmlFor="full_name">* שם מלא</label>
            <input
              ref={nameRef}
              type="text"
              name="full_name"
              id="full_name"
              required
            />

            <label htmlFor="fathers_name">* שם האב</label>
            <input
              ref={fathersNameRef}
              type="text"
              name="fathers_name"
              id="fathers_name"
              required
            />

            <label htmlFor="invested_amount">* סכום כולל</label>
            <input
              ref={amountRef}
              type="number"
              name="invested_amount"
              id="invested_amount"
              min={0}
              required
            />

            <label htmlFor="type">* סטטוס טיפול</label>
            <select
              ref={titleRef}
              name="type"
              id="type"
              required
              defaultValue=""
            >
              <option value="" disabled>
                -- בחר אפשרות --
              </option>
              {statusArr.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="body">* תיאור</label>
            <textarea
              ref={bodyRef}
              type="text"
              name="body"
              id="body"
              required
            />

            <button>הוסף</button>
          </form>
        </>
      )}
      {openAlert && <SnackbarMUI state={state} message={messags} />}
    </>
  );
}

export default AddArchive;
