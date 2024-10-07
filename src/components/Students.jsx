import classes from "../css/students.module.css";
import React, { useEffect, useState, useContext, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import StudentsCard from "./students-comp/StudentsCard";
import { getStudents } from "../data-base/select";

import { UserContext } from "../App";
import AddStudentBtn from "./students-comp/AddStudentBtn";

function Students() {
  //   const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [students, setStudents] = useState([]);

  const getstud = useCallback(async () => {
    const studentsData = await getStudents(user.UID);
    setStudents(studentsData);
  }, [user.UID]); // תוסיף את user.UID כתלות
  
  useEffect(() => {
    document.title = "ניהול תלמידים";
    getstud();
  }, [user, getstud]);
  return (
    <div>
      <div className={classes.headerAddStudentBtn}>
        <h1 className={classes.h1}>ניהול תלמידים</h1>
        <p className={classes.p}>נא בחר בתלמיד הרצוי</p>
        <AddStudentBtn  getstud={getstud}/>
      </div>

      <div className={classes.studentsContainer}>
        {students.map((student, index) => {
          return (
            <div key={index}>
              <div className={classes.student}>
                <StudentsCard student={student} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Students;
