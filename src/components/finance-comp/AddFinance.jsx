import classes from "../../css/finance.module.css";
import React, { useRef, useState } from "react";
// import { addFinance } from "../../data-base/insert";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SnackbarMUI from "../../services/SnackbarMUI";

export const revenuesArr = ["מימון תלמיד", "תרומה"];
export const expensesArr = ["עלונים והדפסות", "אבחון / טיפול"];

function AddFinance({ fetchData }) {
  const categoryRef = useRef(null);
  const amountRef = useRef(null);
  const detailsRef = useRef(null);
  const [type, setType] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");

  const handleAddFinance = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      const date = new Date();
      const newFinance = {
        type: type,
        category: categoryRef.current.value,
        amount: amountRef.current.value,
        details: detailsRef.current.value,
        time: date,
      };
      setOpenForm(false);

      const data = await fetch(
        `https://addfinance${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            uid: u.uid,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFinance),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("השורה נוספה בהצלחה");
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
        className={classes.addFinanceBtn}
        onClick={() => setOpenForm(true)}
      >
        + הוספת שורה
      </button>
      {openForm && (
        <>
          <div
            className={classes.overlayAdd}
            onClick={() => setOpenForm(false)}
          ></div>
          <form onSubmit={handleAddFinance} className={classes.addFinanceForm}>
            <select
              onChange={(e) => setType(e.target.value)}
              name="type"
              id="type"
              required
              defaultValue=""
            >
              <option value="" disabled>
                -- בחר אפשרות --
              </option>
              <option value="הכנסה">הכנסה</option>
              <option value="הוצאה">הוצאה</option>
            </select>
            {type === "הכנסה" ? (
              <RevenuesOptions categoryRef={categoryRef} />
            ) : (
              type === "הוצאה" && <ExpensesOptions categoryRef={categoryRef} />
            )}
            <label htmlFor="amount">סכום</label>
            <input
              ref={amountRef}
              type="number"
              name="amount"
              id="amount"
              required
            />

            <label htmlFor="details">פרטים נוספים</label>
            <textarea
              ref={detailsRef}
              type="text"
              name="details"
              id="details"
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

function RevenuesOptions({ categoryRef }) {
  return (
    <select
      ref={categoryRef}
      name="category"
      id="category"
      required
      defaultValue=""
    >
      <option value="" disabled>
        -- בחר אפשרות --
      </option>

      {revenuesArr.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

function ExpensesOptions({ categoryRef }) {
  return (
    <select
      ref={categoryRef}
      name="category"
      id="category"
      required
      defaultValue=""
    >
      <option value="" disabled>
        -- בחר אפשרות --
      </option>
      {expensesArr.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

export default AddFinance;
