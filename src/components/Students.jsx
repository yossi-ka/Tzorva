import classes from "../css/students.module.css";
import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import StudentsCard from "./StudentsCard";
import { getStudents } from "../data-base/select";

import { UserContext } from "../App";

function Students() {
  //   const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    document.title = "ניהול תלמידים";
    const getstud = async () => {
      getStudents(user.UID).then((students) => setStudents(students));
    };
    getstud();
  }, [user]);
  return (
    <div>
      <h1 className={classes.title}>ניהול תלמידים</h1>
      <h4 className={classes.h4}>נא בחר בתלמיד הרצוי</h4>

      <div className={classes.studentsContainer}>
        {students.map((student, index) => {
          return (
            <div className={classes.student} key={index}>
              <StudentsCard {...student} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Students;
