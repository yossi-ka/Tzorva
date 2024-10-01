import classes from "../css/students.module.css";
import React from "react";

function Student(student) {
  const colorCity =
    student.urgency_level === "גבוה"
      ? "red"
      : student.urgency_level === "בינוני"
      ? "orange"
      : "green";

  return (
    <div
      style={{ border: `4px solid ${colorCity}` }}
      className={classes.studentCardContainer}
    >
      <h3 className={classes.studentName}>
        {`${student.first_name} ${student.last_name}`}
      </h3>
      <p className={classes.studentCity}>{`${student.city_of_school}`}</p>
    </div>
  );
}

export default Student;
