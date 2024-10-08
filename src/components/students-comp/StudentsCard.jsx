import React, { useState } from "react";
import classes from "../../css/students.module.css";
import DeleteStudent from "./DeleteStudent";

function StudentCard({ student, deleteStudent, showDocs, getstud }) {
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const colorUrgency =
    student.urgency_level === "גבוה"
      ? "red"
      : student.urgency_level === "בינוני"
      ? "orange"
      : "lightgreen";

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
        <p className={classes.class}>{`כיתה ${student.class}'`}</p>
      </div>
      <div className={classes.btns}>
        {deleteStudent && <button className={classes.editBtn}>📝 ערוך</button>}
        {deleteStudent && (
          <button
            className={classes.deleteBtn}
            onClick={() => setShowDeleteForm(!showDeleteForm)}
          >
            🗑️ מחק
          </button>
        )}
        {showDocs && <button className={classes.docsBtn}>📄 מסמכים</button>}
        <button className={classes.treatmentsBtn}>📃 טיפולים</button>
      </div>
      {showDeleteForm && (
        <>
          <div className={classes.overlay} onClick={() => setShowDeleteForm(false)}></div>
          <div className={classes.deleteFormArea}>
            <DeleteStudent getstud={getstud} student={student} setShowDeleteForm={setShowDeleteForm}  />
          </div>
        </>
      )}
    </div>
  );
}

export default StudentCard;
