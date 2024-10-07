import React from "react";
import classes from "../../css/students.module.css";

function Student({ student }) {

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
        <button className={classes.editBtn}>📝 ערוך</button>
        <button className={classes.deleteBtn}>🗑️ מחק</button>
        <button className={classes.docsBtn}>📄 מסמכים</button>
        <button className={classes.treatmentsBtn}>📃 טיפולים</button>
      </div>
    </div>
  );
}

export default Student;
