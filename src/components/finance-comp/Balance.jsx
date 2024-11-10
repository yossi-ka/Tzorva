import classes from "../../css/finance.module.css";
import React, { useState } from "react";

function Balance({ financeToShow }) {
  const [showBalance, setShowBalance] = useState(false);
  return (
    <div className={classes.balanceArea}>
      <button onClick={() => setShowBalance(true)}>
        <span className="material-symbols-outlined">balance</span> הצג מאזן
      </button>
      {showBalance && (
        <div className={classes.balance}>
          <div
            className={classes.overlay}
            onClick={() => setShowBalance(false)}
          ></div>
          <div className={classes.balanceDetails}>
            <h2>מאזן פיננסים לפי טווח התאריכים הנבחר</h2>
            <h4>סה"כ הכנסות:</h4>
            <h3>
              {financeToShow.reduce((total, value) => {
                if (value.type === "הכנסה") {
                  return total + Number(value.amount);
                }
                return total;
              }, 0)}{" "}
              ₪
            </h3>
            <h4>סה"כ הוצאות:</h4>
            <h3>
              {financeToShow.reduce((total, value) => {
                if (value.type === "הוצאה") {
                  return total + Number(value.amount);
                }
                return total;
              }, 0)}{" "}
              ₪
            </h3>
            <h4>סה"כ:</h4>
            <h3>
              {financeToShow.reduce((total, value) => {
                if (value.type === "הכנסה") {
                  return total + Number(value.amount);
                }
                return total - Number(value.amount);
              }, 0)}{" "}
              ₪
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default Balance;
