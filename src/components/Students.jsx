import classes from "../css/students.module.css";
import React, { useEffect, useState, useContext, useCallback } from "react";
import StudentsCard from "./students-comp/StudentsCard";
import { getStudents } from "../data-base/select";

import { UserContext } from "../App";
import AddStudentBtn from "./students-comp/AddStudentBtn";

function Students() {
  //   const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [addStudent, setAddStudent] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [students, setStudents] = useState([]);

  const getstud = useCallback(async () => {
    const studentsData = await getStudents(user.UID);
    setStudents(studentsData);
  }, [user.UID]);

  useEffect(() => {
    document.title = "תלמידים";
    getstud();
    setAddStudent(user.access_permissions?.actions?.add_student);
    setDeleteStudent(user.access_permissions?.actions?.delete_student);
    setShowDocs(user.access_permissions?.actions?.show_docs);
  }, [user, getstud]);
  return (
    <div>
      <div className={classes.headerAddStudentBtn}>
        <h1 className={classes.h1}>ניהול תלמידים</h1>
        <p className={classes.p}>נא בחר בתלמיד הרצוי</p>
        {addStudent && <AddStudentBtn getstud={getstud} />}
      </div>

      <div className={classes.studentsContainer}>
        {students.map((student, index) => {
          return (
            <div key={index}>
              <div className={classes.student}>
                <StudentsCard
                  getstud={getstud}
                  student={student}
                  deleteStudent={deleteStudent}
                  showDocs={showDocs}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Students;
