import React, { useRef, useState } from "react";
import { addFinance } from "../../data-base/insert";

function AddFinance({ fetchData }) {
  const categoryRef = useRef(null);
  const amountRef = useRef(null);
  const detailsRef = useRef(null);
  const [type, setType] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const handleAddFinance = async(e) => {
    e.preventDefault();
    const date = new Date();
    const newFinance = {
      type: type,
      category: categoryRef.current.value,
      amount: amountRef.current.value,
      details: detailsRef.current.value,
      time: date,
    };
    await addFinance(newFinance);
    fetchData();
  };
  return (
    <>
      <button onClick={() => setOpenForm(true)}>+ הוספת פעולה</button>
      {openForm && (
        <form>
          <select
            onChange={(e) => setType(e.target.value)}
            name="type"
            id="type"
            required
          >
            <option value="" disabled>
              -- בחר אפשרות --
            </option>
            <option value="הכנסה">הכנסה</option>
            <option value="הוצאה">הוצאה</option>
          </select>
          <label htmlFor="amount">סכום</label>
          <input
            ref={amountRef}
            type="number"
            name="amount"
            id="amount"
            required
          />
          {type === "הכנסה" ? (
            <RevenuesOptions categoryRef={categoryRef} />
          ) : (
            type === "הוצאה" && <ExpensesOptions categoryRef={categoryRef} />
          )}
          <label htmlFor="details">פרטים נוספים</label>
          <textarea
            ref={detailsRef}
            type="text"
            name="details"
            id="details"
            required
          />
          <button type="submit" onClick={handleAddFinance}>
            הוסף
          </button>
        </form>
      )}
    </>
  );
}

function RevenuesOptions({ categoryRef }) {
  return (
    <select ref={categoryRef} name="category" id="category" required>
      <option value="" disabled>
        -- בחר אפשרות --
      </option>
      <option value="מימון">מימון</option>
      <option value="תרומה">תרומה</option>
    </select>
  );
}

function ExpensesOptions({ categoryRef }) {
  return (
    <select ref={categoryRef} name="category" id="category" required>
      <option value="" disabled>
        -- בחר אפשרות --
      </option>
      <option value="עלונים והדפסות">עלונים והדפסות</option>
      <option value="אבחון / טיפול">אבחון / טיפול</option>
    </select>
  );
}

export default AddFinance;
