import classes from "../css/users.module.css";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import UserCard from "./usersManage-comp/UserCard";
import { getAllUsers } from "../data-base/select";
import AddUserBtn from "./usersManage-comp/AddUserBtn";
import SearchField from "../services/SearchField";
import { useNavigate } from "react-router-dom";

function UsersManage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [usersToShow, setUsersToShow] = useState([]);

  const getuse = async () => {
    const usersData = await getAllUsers();
    setUsers(usersData);
    setUsersToShow(usersData);
  };
  useEffect(() => {
    if (user?.access_permissions?.users_manage === false) {
      navigate("/home");
      return;
    }
    document.title = "ניהול משתמשים";
    getuse();
  }, [navigate, user]);
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

      <div className={classes.userContainer}>
        {usersToShow.map((user, index) => (
          <UserCard key={index} user={user} getuse={getuse} />
        ))}
      </div>
    </div>
  );
}

export default UsersManage;
