import classes from "../css/home.module.css";
import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../App";

function Home() {
  const { user } = useContext(UserContext);
  const [accessFinance, setAccessFinance] = useState(false);
  const accessArchive = user?.access_permissions?.archive;
  const [usersManage, setUsersManage] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "צורבא - דף הבית";
    setAccessFinance(user?.access_permissions?.finance);
    setUsersManage(user?.access_permissions?.users_manage);
  }, [setAccessFinance, setUsersManage, user]);

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>ברוך הבא למערכת ניהול צורבא</h1>
      <div className={classes.homeOptions}>
        <div className={`${classes.option} ${classes.studArea}`}>
          <div className={`${classes.studAreaTitle} ${classes.areaTitle}`}>
            <h1 className={classes.h1}>תלמידים</h1>
            <span
              style={{ fontSize: "40px" }}
              className="material-symbols-outlined"
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
              כניסה לתלמידים
            </button>
          </div>
        </div>

        {accessFinance && (
          <div className={`${classes.option} ${classes.financeArea}`}>
            <div className={`${classes.financeAreaTitle} ${classes.areaTitle}`}>
              <h1 className={classes.h1}>כספים</h1>{" "}
              <span
                style={{ fontSize: "40px" }}
                className="material-symbols-outlined"
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
        )}

        {usersManage && (
          <div className={`${classes.option} ${classes.userMngArea}`}>
            <div className={`${classes.userMngAreaTitle} ${classes.areaTitle}`}>
              <h1 className={classes.h1}> משתמשים</h1>
              <span
                style={{ fontSize: "40px" }}
                className="material-symbols-outlined"
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
        )}

        <div className={`${classes.option} ${classes.treatmentArea}`}>
          <div
            className={`${classes.treatmentsAreaTitle} ${classes.areaTitle}`}
          >
            <h1 className={classes.h1}>טיפולים</h1>
            <span
              style={{ fontSize: "40px" }}
              className="material-symbols-outlined"
            >
              format_list_bulleted
            </span>
          </div>
          <div className={classes.areaBot}>
            <p className={classes.p}>
              צפייה בדוחו"ת טיפולים, עדכון והוספת טיפולים לתלמידים.
            </p>
            <button
              className={`${classes.treatmentsBtn} ${classes.btn}`}
              onClick={() => navigate("/treatments")}
            >
              כניסה לטיפולים
            </button>
          </div>
        </div>

        {accessArchive && (
          <div className={`${classes.option} ${classes.archiveArea}`}>
            <div className={`${classes.archiveAreaTitle} ${classes.areaTitle}`}>
              <h1 className={classes.h1}>ארכיון</h1>
              <span
                style={{ fontSize: "40px" }}
                className="material-symbols-outlined"
              >
                archive
              </span>
            </div>
            <div className={classes.areaBot}>
              <p className={classes.p}>
                צפייה בארכיון התלמידים שטופלו ע"י הארגון, עדכון ומחיקת תיעודים.
              </p>
              <button
                className={`${classes.archiveBtn} ${classes.btn}`}
                onClick={() => navigate("/archive")}
              >
                כניסה לארכיון
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
