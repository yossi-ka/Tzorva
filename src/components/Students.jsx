import classes from "../css/students.module.css";
import React, { useEffect, useState, useContext, useCallback } from "react";
import StudentsCard from "./students-comp/StudentsCard";
import { getStudents } from "../data-base/select";

import { UserContext } from "../App";
import AddStudentBtn from "./students-comp/AddStudentBtn";
import SearchField from "../services/SearchField";
import SortStudents from "./students-comp/SortStudents";

function Students() {
  const { user } = useContext(UserContext);

  const [addStudent, setAddStudent] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsToShow, setStudentsToShow] = useState([]);

  const getstud = useCallback(async () => {
    const studentsData = await getStudents(user.UID);
    setStudents(studentsData);
    setStudentsToShow(studentsData);
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
        <SearchField
          allItems={students}
          itemsToShow={studentsToShow}
          setItemsToShow={setStudentsToShow}
          placeholder="חיפוש תלמיד"
        />
        <SortStudents
          allStudents={students}
          setStudentsToShow={setStudentsToShow}
        />
        <div>{addStudent && <AddStudentBtn getstud={getstud} />}</div>
      </div>

      <div className={classes.studentsContainer}>
        {studentsToShow.map((student, index) => {
          return (
            <div key={index}>
              <div className={classes.student}>
                <StudentsCard
                  getstud={getstud}
                  student={student}
                  addStudent={addStudent}
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
