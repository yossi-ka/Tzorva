import classes from "../css/stud2.module.css";
import React, { useEffect, useState, useContext } from "react";
import StudentsCard from "./students-comp/StudentsCard";
// import { getStudents } from "../data-base/select";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

  const getstud = async (currentUser) => {
    // בדיקה אם יש משתמש מחובר
    if (!currentUser) {
      console.error("אין משתמש מחובר.");
      return;
    }

    try {
      const idToken = await currentUser.getIdToken();
      const uid = currentUser.uid;

      const response = await fetch(
        `https://getstudents${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "GET",
          headers: {
            uid: uid,
            authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const studentsData = await response.json();
      setStudents(studentsData.massage);
      setStudentsToShow(studentsData.massage);
    } catch (error) {
      console.error("Error fetching students:", error.message || error);
    }
  };

  useEffect(() => {
    document.title = "תלמידים";
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      getstud(u);
    });
    setAddStudent(user.access_permissions?.actions?.add_student);
    setDeleteStudent(user.access_permissions?.actions?.delete_student);
    setShowDocs(user.access_permissions?.actions?.show_docs);
    return () => unsubscribe();
  }, [user]);

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
