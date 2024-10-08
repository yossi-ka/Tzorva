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
        <h1 className={classes.h1}>ניהול משתמשים</h1>
        <p className={classes.p}>נא בחר במשתמש הרצוי</p>
        <AddUserBtn getUsers={getUsers} />
      </div>
      {users.map((user, index) => (
        <div key={index} className={classes.usersContainer}>
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
}

export default UsersManage;
