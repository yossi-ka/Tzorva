import classes from "../css/header.module.css";
import { logout } from "../data-base/authentication";
import React, { useEffect, useContext } from "react";
import { getCurrentUser } from "../data-base/authentication";
import { findUserByUID } from "../data-base/select";

import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    const unsubscribe = getCurrentUser(async (user) => {
      const userDetails = await findUserByUID(user.uid);
      setUser(userDetails);
    });
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe(); // בטל את ההאזנה בעת הצורך
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
      <button
        className={classes.btnProfile}
        onClick={() => navigate("/profile")}
      >
        שלום, הרב{" "}
        {user?.first_name && user?.last_name
          ? user.first_name + " " + user.last_name
          : "..."}
      </button>
      <button className={classes.btnLogout} onClick={handleLogout}>
        התנתקות
        <span className="material-symbols-outlined">logout</span>
      </button>
    </div>
  );
}

export default Header;
