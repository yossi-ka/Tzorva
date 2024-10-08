import classes from "../css/usersManage.module.css";
import React, { useEffect, useState } from "react";
import UserCard from "./usersManage-comp/UserCard";
import { getAllUsers } from "../data-base/select";

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
      {users.map((user, index) => (
        <div key={index} className={classes.usersContainer}>
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
}

export default UsersManage;
