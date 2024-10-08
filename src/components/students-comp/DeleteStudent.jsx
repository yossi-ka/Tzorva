import classes from "../../css/students.module.css";
import React, { useRef, useState } from "react";
import { addArchive } from "../../data-base/insert";
import { deleteStudent } from "../../data-base/delete";

function DeleteStudent({ student, setShowDeleteForm, getstud }) {
  const reasonRef = useRef(null);
  const textareaRef = useRef(null);
  const amountRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowWarning(true);
  };

  const handleDeleteStudent = async () => {
    const newArchive = {
      full_name: student.first_name + " " + student.last_name,
      student_id: student.student_id,
      title: reasonRef.current.value,
      invested_amount: amountRef.current.value,
      body: textareaRef.current.value,
      fathers_name: student.fathers_name,
    };

    await addArchive(newArchive);
    setShowDeleteForm(false);
    await deleteStudent(student);
    getstud();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.deleteForm}>
        <h1 className={classes.h1}>מחיקת תלמיד</h1>
        <h3 className={classes.h3}>
          פעולה זו תמחק את כל הנתונים לתלמיד זה. <br />
          שים לב! לא ניתן יהיה לשחזר את הנתונים!
        </h3>
        <label className={classes.label} htmlFor="name">
          שם:
        </label>
        <input
          className={classes.input}
          disabled
          id="name"
          type="text"
          value={`${student.first_name} ${student.last_name}`}
        />
        <label className={classes.label} htmlFor="studentId">
          מס' זהות:
        </label>
        <input
          className={classes.input}
          id="studentId"
          type="text"
          value={student.student_id}
          disabled
        />
        <label className={classes.label} htmlFor="reason">סטטוס:</label>
        <select
          ref={reasonRef}
          className={classes.select}
          name="reason"
          id="reason"
        >
          <option className={classes.option} value="הסתיים טיפול">
            הסתיים טיפול
          </option>
          <option className={classes.option} value="עלה לישיבה">
            עלה לישיבה
          </option>
          <option className={classes.option} value="אחר">
            אחר
          </option>
        </select>
        <label className={classes.label} htmlFor="textarea">
          סיכום קצר:
        </label>
        <textarea
          ref={textareaRef}
          required
          className={classes.textarea}
          name="textarea"
          id="textarea"
          cols={20}
          rows={5}
        ></textarea>
        <label className={classes.label} htmlFor="amount">
          סך הוצאות עבור תלמיד זה:
        </label>
        <input
          ref={amountRef}
          required
          className={classes.input}
          type="number"
          id="amount"
        />
        <button className={classes.continueBtn}>המשך</button>
      </form>
      {showWarning && (
        <>
          <div className={classes.overlaySure}></div>
          <div className={classes.warning}>
            <h1 className={classes.h1Warning}>האם אתה בטוח?</h1>
            <div className={classes.lastBtns}>
              <button
                className={classes.deleteStudentBtn}
                onClick={handleDeleteStudent}
              >
                מחק
              </button>
              <button
                className={classes.cancelBtn}
                onClick={() => setShowWarning(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DeleteStudent;
