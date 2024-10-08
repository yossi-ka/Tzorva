import classes from "../css/users.module.css";
import React, { useEffect, useState } from "react";
import UserCard from "./usersManage-comp/UserCard";
import { getAllUsers } from "../data-base/select";
import AddUserBtn from "./usersManage-comp/AddUserBtn";

function UsersManage() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const usersData = await getAllUsers();
    setUsers(usersData);
  };
  useEffect(() => {
    document.title = "ניהול משתמשים";
    getUsers();
  }, []);
  return (
    <div>
      <div className={classes.headerAddUserBtn}>
        <h1 className={classes.h1Header}>ניהול משתמשים</h1>
        <p className={classes.pHeader}>נא בחר במשתמש הרצוי</p>
        <AddUserBtn getUsers={getUsers} />
      </div>

      <div className={classes.userContainer}>
        {users.map((user, index) => (
          // <div key={index} className={classes.userContainer}>
            <UserCard key={index} user={user} />
          // </div>
        ))}
      </div>
    </div>
  );
}

export default UsersManage;
