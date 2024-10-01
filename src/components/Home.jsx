import classes from "../css/home.module.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "צורבא - דף הבית";
  }, []);
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>ברוך הבא למערכת ניהול צורבא</h1>
      <div className={classes.homeOptions}>
        <div className={`${classes.option} ${classes.studArea}`}>
          <div className={`${classes.studAreaTitle} ${classes.areaTitle}`}>
            <h1 className={classes.h1}>ניהול תלמידים</h1>
            <span
              style={{ fontSize: "40px" }}
              class="material-symbols-outlined"
            >
              diversity_3
            </span>
          </div>
          <div className={classes.areaBot}>
            <p className={classes.p}>
              צפייה ועדכון פרטי תלמידים, סטטוס ודחיפות טיפול, עדכוני טיפולים.
            </p>
            <button
              className={`${classes.studBtn} ${classes.btn}`}
              onClick={() => navigate("/students")}
            >
              כניסה לניהול תלמידים
            </button>
          </div>
        </div>

        <div className={`${classes.option} ${classes.financeArea}`}>
          <div className={`${classes.financeAreaTitle} ${classes.areaTitle}`}>
            <h1 className={classes.h1}>ניהול כספים</h1>{" "}
            <span
              style={{ fontSize: "40px" }}
              class="material-symbols-outlined"
            >
              attach_money
            </span>
          </div>
          <div className={classes.areaBot}>
            <p className={classes.p}>
              צפייה במאזן הכללי, הוספת ועדכון פעולות כספיות.
            </p>
            <button
              className={`${classes.financeBtn} ${classes.btn}`}
              onClick={() => navigate("/finance")}
            >
              כניסה לניהול כספים
            </button>
          </div>
        </div>
        <div className={`${classes.option} ${classes.userMngArea}`}>
          <div className={`${classes.userMngAreaTitle} ${classes.areaTitle}`}>
            <h1 className={classes.h1}> ניהול משתמשים</h1>
            <span
              style={{ fontSize: "40px" }}
              
              class="material-symbols-outlined"
            >
              manage_accounts
            </span>
          </div>
          <div className={classes.areaBot}>
            <p className={classes.p}>
              הוספת והסרת משתמשים, עדכון פרטי משתמשים.
            </p>
            <button
              className={`${classes.userMngBtn} ${classes.btn}`}
              onClick={() => navigate("/users-manage")}
            >
              כניסה לניהול משתמשים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
