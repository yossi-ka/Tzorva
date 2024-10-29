import classes from "../../css/archive.module.css";
import React, { useRef, useState } from "react";
import { statusArr } from "./AddArchive";
import { updateArchive } from "../../data-base/update";

function EditArchive({ archive, fetchData }) {
  const [showEditForm, setShowEditForm] = useState(false);

  const titleRef = useRef();
  const amountRef = useRef();
  const bodyRef = useRef();

  const handleEdit = (e) => {
    e.preventDefault();
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
    updateArchive(archive, formData);
    fetchData();
    setShowEditForm(false);
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
                {statusArr.map((item) => (
                  <option key={item} value={item}>
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
    </>
  );
}

export default EditArchive;