import classes from "../css/header.module.css";
import { logout } from "../data-base/authentication";
import React, { useEffect, useContext } from "react";
import { useNotification } from "./massage-comp/NotificationContext";
import { getCurrentUser } from "../data-base/authentication";

import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const { notifNum } = useNotification();

  useEffect(() => {
    const unsubscribe = getCurrentUser(async (user) => {
      if (user) {
        const auth = getAuth();
        onAuthStateChanged(auth, async (u) => {
          const data = await fetch(
            `https://getuserbyuid${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
            {
              method: "GET",
              headers: {
                uid: u.uid,
                authorization: `Bearer ${await u.getIdToken()}`,
                "Content-Type": "application/json",
              },
            }
          );

          const res = await data.json();

          setUser(res.message);
        });
      } else {
        console.log("not logged in");
      }
    });
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [setUser]);

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setUser({});
    navigate("/login");
  };

  return (
    <div className={classes.header}>
      <img
        className={classes.img}
        src="/assets/logo-Tzorva.png"
        alt="לוגו צורבא"
        onClick={() => navigate("/home")}
      />
      <div className={classes.profile}>
        <button
          className={classes.btnProfile}
          onClick={() => navigate("/profile")}
        >
          שלום, הרב{" "}
          {user?.first_name && user?.last_name
            ? user.first_name + " " + user.last_name
            : "..."}
        </button>
        {notifNum !== 0 && (
          <span
            onClick={() => navigate("/messages")}
            className="material-symbols-outlined"
          >
            <div className={classes.notification}>
              <p>{notifNum}</p>
            </div>
            notifications
          </span>
        )}
      </div>
      <button className={classes.btnLogout} onClick={handleLogout}>
        התנתקות
        <span className="material-symbols-outlined">logout</span>
      </button>
    </div>
  );
}

export default Header;
