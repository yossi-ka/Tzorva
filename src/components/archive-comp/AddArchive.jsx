import classes from "../../css/archive.module.css";
import React, { useRef, useState } from "react";
import { addArchive } from "../../data-base/insert";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const statusArr = ["עלה לישיבה", "הסתיים טיפול", "אחר"];

function AddArchive({ fetchData }) {
  const idRef = useRef(null);
  const nameRef = useRef(null);
  const amountRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const fathersNameRef = useRef(null);
  const [openForm, setOpenForm] = useState(false);

  const handleAddArchive = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      
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
      await addArchive(newArchive);
      fetchData(u);
      setOpenForm(false);
    })
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
            <label htmlFor="student_id">תעודת זהות</label>
            <input
              ref={idRef}
              type="text"
              maxLength={9}
              name="student_id"
              id="student_id"
              required
            />

            <label htmlFor="full_name">שם מלא</label>
            <input
              ref={nameRef}
              type="text"
              name="full_name"
              id="full_name"
              required
            />

            <label htmlFor="fathers_name">שם האב</label>
            <input
              ref={fathersNameRef}
              type="text"
              name="fathers_name"
              id="fathers_name"
              required
            />

            <label htmlFor="invested_amount">סכום כולל</label>
            <input
              ref={amountRef}
              type="number"
              name="invested_amount"
              id="invested_amount"
              required
            />

            <label htmlFor="type">סטטוס טיפול</label>
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

            <label htmlFor="body">תיאור</label>
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
    </>
  );
}

export default AddArchive;
