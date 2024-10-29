import classes from "../../css/finance.module.css";
import React, { useRef, useState } from "react";
import { expensesArr, revenuesArr } from "./AddFinance";
import { formatDateToHebrew } from "../Finance";
import { updateFinance } from "../../data-base/update";

function EditFinance({ finance, fetchData }) {
  const [showEditForm, setShowEditForm] = useState(false);

  const categoryRef = useRef();
  const amountRef = useRef();
  const detailsRef = useRef();

  const category = finance.type === "הכנסה" ? revenuesArr : expensesArr;
  const handleEdit = (e) => {
    e.preventDefault();
    const formData = {};
    if (categoryRef.current.value !== finance.category) {
      formData.category = categoryRef.current.value;
    }

    if (amountRef.current.value !== finance.amount) {
      formData.amount = amountRef.current.value;
    }

    if (detailsRef.current.value !== finance.details) {
      formData.details = detailsRef.current.value;
    }
    updateFinance(finance, formData);
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
              <h1>עריכת שורה</h1>
              <label htmlFor="date">תאריך:</label>
              <input
                type="text"
                id="date"
                name="date"
                defaultValue={formatDateToHebrew(finance.time)}
                disabled
              />
              <label htmlFor="type">סוג:</label>
              <input
                type="text"
                id="type"
                name="type"
                defaultValue={finance.type}
                disabled
              />
              <label htmlFor="category">קטגוריה:</label>
              <select
                ref={categoryRef}
                id="category"
                name="category"
                defaultValue={finance.category}
              >
                {category.map((item) => (
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
                defaultValue={finance.amount}
              />

              <label htmlFor="details">פרטים:</label>
              <input
                ref={detailsRef}
                type="text"
                id="details"
                name="details"
                defaultValue={finance.details}
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

export default EditFinance;