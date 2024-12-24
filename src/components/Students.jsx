import classes from "../css/student.module.css";
import React, { useEffect, useState, useContext } from "react";
import StudentsCard from "./students-comp/StudentsCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { UserContext } from "../App";
import AddStudentBtn from "./students-comp/AddStudentBtn";
import SearchField from "../services/SearchField";
import SortStudents from "./students-comp/SortStudents";
import { CircularProgress } from "@mui/material";
import FilterStudents from "./students-comp/FilterStudents";

function Students() {
  const { user } = useContext(UserContext);

  const [addStudent, setAddStudent] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsToShow, setStudentsToShow] = useState([]);
  const [loading, setLoading] = useState(false);

  const getstud = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      const uid = u.uid;

      try {
        await fetch(
          `https://getstudents${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
          {
            method: "GET",
            headers: {
              uid: uid,
              authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((d) => {
            setLoading(false);
            setStudents(d.message);
            setStudentsToShow(d.message);
          });
      } catch (error) {
        console.error("Error fetching students:", error.message || error);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
  }, []);

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
        <FilterStudents
          studentsToShow={studentsToShow}
          setStudentsToShow={setStudentsToShow}
        />
        <SortStudents
          allStudents={students}
          setStudentsToShow={setStudentsToShow}
        />
        <div>{addStudent && <AddStudentBtn getstud={getstud} />}</div>
      </div>

      {loading && <CircularProgress sx={{ m: "3rem" }} />}
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
