import React, { useEffect, useRef, useState } from "react";
import classes from "../../css/users.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function UpdatePermissions({
  setShowUpdatePermissions,
  user,
  getuse,
  setAlert,
}) {
  const [currentPermissions, setCurrentPermissions] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [studentIdList1, setStudentIdList1] = useState([]);
  const [studentIdList2, setStudentIdList2] = useState([]);

  const { setOpenAlert, setState, setMessags } = setAlert;

  const deleteInterventionRef = useRef();
  const financeRef = useRef();
  const archiveRef = useRef();
  const addStudentRef = useRef();
  const deleteStudentRef = useRef();
  const showDocsRef = useRef();

  useEffect(() => {
    const getStude = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (u) => {
        const idToken = await u.getIdToken();
        await fetch(
          `https://getstudents${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
          {
            method: "GET",
            headers: {
              uid: u.uid,
              authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((d) => {
            const { message } = d.message;
            setStudentList(message);
          });
        setCurrentPermissions(user?.access_permissions);
        setStudentIdList1(user?.access_permissions?.students || []);
        setStudentIdList2(user?.access_permissions?.students || []);
      });
    };
    getStude();
  }, [user]);

  const compareArrs = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    arr1.sort();
    arr2.sort();
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  const handleUpdatePermissions = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      // יצירת אובייקט עם כל ההרשאות הנוכחיות כבסיס
      const newPermissions = {
        ...currentPermissions,
        students: [...studentIdList1], // תמיד לשלוח את הרשימה המעודכנת
        actions: {
          ...currentPermissions?.actions,
          add_student: addStudentRef.current.checked,
          delete_interventions: deleteInterventionRef.current.checked,
          delete_student: deleteStudentRef.current.checked,
          show_docs: showDocsRef.current.checked,
        },
        finance: financeRef.current.checked,
        archive: archiveRef.current.checked,
      };

      // בדיקה אם יש שינויים בכלל
      const hasChanges =
        !compareArrs(studentIdList1, studentIdList2) ||
        newPermissions.finance !== currentPermissions?.finance ||
        newPermissions.archive !== currentPermissions?.archive ||
        newPermissions.actions.add_student !==
          currentPermissions?.actions?.add_student ||
        newPermissions.actions.delete_interventions !==
          currentPermissions?.actions?.delete_interventions ||
        newPermissions.actions.delete_student !==
          currentPermissions?.actions?.delete_student ||
        newPermissions.actions.show_docs !==
          currentPermissions?.actions?.show_docs;

      setShowUpdatePermissions(false);

      if (hasChanges) {
        await fetch(
          `https://edituser${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${idToken}`,
              uid: u.uid,
            },
            body: JSON.stringify({
              user_id: user.user_id,
              access_permissions: newPermissions,
            }),
          }
        ).then((res) => {
          if (res.ok) {
            setMessags("פרטי המשתמש עודכנו בהצלחה");
            setState("success");
            setOpenAlert(true);
            setTimeout(() => {
              setOpenAlert(false);
            }, 4000);
            getuse(u);
          } else {
            setMessags("שגיאה, אנא נסה שוב");
            setState("error");
            setOpenAlert(true);
            setTimeout(() => {
              setOpenAlert(false);
            }, 4000);
          }
        });
      }
    });
  };

  const handleCheckedStudent = (checked, student_id) => {
    if (checked) {
      setStudentIdList1((prev) => [...prev, student_id]);
    } else {
      setStudentIdList1((prev) => prev.filter((id) => id !== student_id));
    }
  };

  return (
    <div className={classes.managePermissions}>
      <form
        className={classes.updatePermissinsForm}
        onSubmit={handleUpdatePermissions}
      >
        <h1>עדכון הרשאות משתמש</h1>

        {/* Student Management Section */}
        <div className={classes.permissionSection}>
          <h3 className={classes.sectionTitle}>ניהול תלמידים</h3>
          <div className={classes.checkboxGroup}>
            <input
              ref={addStudentRef}
              type="checkbox"
              id="addStudent"
              name="addStudent"
              defaultChecked={currentPermissions?.actions?.add_student}
            />
            <label htmlFor="addStudent">הוספת ועריכת תלמיד</label>
          </div>
          <div className={classes.checkboxGroup}>
            <input
              ref={deleteStudentRef}
              type="checkbox"
              id="deleteStudent"
              name="deleteStudent"
              defaultChecked={currentPermissions?.actions?.delete_student}
            />
            <label htmlFor="deleteStudent">מחיקת תלמיד</label>
          </div>
          <div className={classes.checkboxGroup}>
            <input
              ref={showDocsRef}
              type="checkbox"
              id="showDocs"
              name="showDocs"
              defaultChecked={currentPermissions?.actions?.show_docs}
            />
            <label htmlFor="showDocs">מסמכים רפואיים</label>
          </div>
        </div>

        {/* Student List Section */}
        <div className={classes.permissionSection}>
          <h3 className={classes.sectionTitle}>צפיה בתלמידים</h3>
          <div className={classes.studentList}>
            {studentList?.map((student, index) => (
              <div key={index} className={classes.checkboxGroup}>
                <input
                  type="checkbox"
                  id={student.student_id}
                  name={student.student_id}
                  defaultChecked={studentIdList1.includes(student.student_id)}
                  onChange={(e) =>
                    handleCheckedStudent(e.target.checked, student.student_id)
                  }
                />
                <label htmlFor={student.student_id}>
                  {student.first_name + " " + student.last_name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Permissions Section */}
        <div className={classes.permissionSection}>
          <h3 className={classes.sectionTitle}>הרשאות נוספות</h3>
          <div className={classes.checkboxGroup}>
            <input
              ref={archiveRef}
              type="checkbox"
              id="archive"
              name="archive"
              defaultChecked={currentPermissions?.archive}
            />
            <label htmlFor="archive">ארכיון</label>
          </div>
          <div className={classes.checkboxGroup}>
            <input
              ref={financeRef}
              type="checkbox"
              id="finance"
              name="finance"
              defaultChecked={currentPermissions?.finance}
            />
            <label htmlFor="finance">פיננסים</label>
          </div>
          <div className={classes.checkboxGroup}>
            <input
              ref={deleteInterventionRef}
              type="checkbox"
              id="deleteIntervention"
              name="deleteIntervention"
              defaultChecked={currentPermissions?.actions?.delete_interventions}
            />
            <label htmlFor="deleteIntervention">מחיקת טיפול</label>
          </div>
        </div>

        <div className={classes.btns}>
          <button
            onClick={handleUpdatePermissions}
            className={classes.updateBtn}
          >
            עדכן
          </button>
          <button
            onClick={() => setShowUpdatePermissions(false)}
            className={classes.cancelBtn}
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePermissions;
