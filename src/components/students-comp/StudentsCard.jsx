import React, { useState } from "react";
import classes from "../../css/students.module.css";
import DeleteStudent from "./DeleteStudent";
import EditStudent from "./EditStudent";
import { useNavigate } from "react-router-dom";

function StudentCard({ student, deleteStudent, showDocs, getstud }) {
  const navigate = useNavigate();
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const colorUrgency =
    student.urgency_level === "גבוה"
      ? "red"
      : student.urgency_level === "בינוני"
      ? "orange"
      : "lightgreen";

  const textClass = () => {
    if (student.class === "גן" || student.class === "מכינה") {
      return `כיתה ${student.class}`;
    } else {
      return `כיתה ${student.class}'`;
    }
  };

  return (
    <div className={classes.studentCardContainer}>
      <div
        className={classes.urgencyLevel}
        style={{ backgroundColor: colorUrgency }}
      ></div>
      <h3 className={classes.studentName}>
        {`${student.first_name} ${student.last_name}`}
      </h3>
      <div className={classes.studentSchoolAndClass}>
        <p className={classes.city}>{student.city_of_school}</p>
        <p className={classes.class}>{textClass()}</p>
      </div>
      <div className={classes.btns}>
        {deleteStudent && (
          <button
            onClick={() => setShowEditStudent(!showEditStudent)}
            className={classes.editBtn}
          >
            📝 ערוך
          </button>
        )}
        {deleteStudent && (
          <button
            className={classes.deleteBtn}
            onClick={() => setShowDeleteForm(!showDeleteForm)}
          >
            🗑️ מחק
          </button>
        )}
        {showDocs && <button className={classes.docsBtn}>📄 מסמכים</button>}
        <button
          onClick={() => navigate(`/intervention/${student.student_id}`)}
          className={classes.interventionsBtn}
        >
          📃 טיפולים
        </button>
      </div>
      {showDeleteForm && (
        <>
          <div
            className={classes.overlay}
            onClick={() => setShowDeleteForm(false)}
          ></div>
          <div className={classes.deleteFormArea}>
            <DeleteStudent
              getstud={getstud}
              student={student}
              setShowDeleteForm={setShowDeleteForm}
            />
          </div>
        </>
      )}
      {showEditStudent && (
        <>
          <div
            className={classes.overlay}
            onClick={() => setShowEditStudent(!showEditStudent)}
          ></div>
          <div className={classes.editStudentArea}>
            <EditStudent
              getstud={getstud}
              setShowEditStudent={setShowEditStudent}
              student={student}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default StudentCard;
