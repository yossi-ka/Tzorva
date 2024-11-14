import classes from "../css/users.module.css";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import UserCard from "./usersManage-comp/UserCard";
import AddUserBtn from "./usersManage-comp/AddUserBtn";
import SearchField from "../services/SearchField";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function UsersManage() {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [usersToShow, setUsersToShow] = useState([]);
  const [loading, setLoading] = useState(false);

  const getuse = async (u) => {
    if (!u) {
      console.error("אין משתמש מחובר");
      return;
    }

    try {
      let idToken = await u.getIdToken();
      let uid = u.uid;

      const response = await fetch(
        `https://getusers${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "GET",
          headers: {
            uid: uid,
            authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const usersData = await response.json();
      setLoading(false);
      setUsers(usersData.message);
      setUsersToShow(usersData.message);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if ((user.job_title = "מנהל ארגון" === false)) {
      navigate(-1);
      return;
    }
    const auth = getAuth();
    onAuthStateChanged(auth, (u) => {
      if (u) getuse(u);
    });
    document.title = "ניהול משתמשים";
  }, [user, navigate]);

  useEffect(() => {
    document.title = "ניהול משתמשים";
    setLoading(true);
  }, []);

  return (
    <div>
      <div className={classes.headerAddUserBtn}>
        <h1 className={classes.h1Header}>ניהול משתמשים</h1>
        <SearchField
          allItems={users}
          setItemsToShow={setUsersToShow}
          placeholder="חיפוש משתמש"
        />
        <AddUserBtn getUsers={getuse} />
      </div>
      {loading && <CircularProgress sx={{ m: "3rem" }} />}
      <div className={classes.userContainer}>
        {usersToShow.map((user, index) => (
          <UserCard key={index} user={user} getuse={getuse} />
        ))}
      </div>
    </div>
  );
}

export default UsersManage;
