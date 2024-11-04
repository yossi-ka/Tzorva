import React, { useState } from "react";
import classes from "../../css/stud2.module.css";
import DeleteStudent from "./DeleteStudent";
import EditStudent from "./EditStudent";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

function StudentCard({
  student,
  addStudent,
  deleteStudent,
  showDocs,
  getstud,
}) {
  const navigate = useNavigate();
  const [showMoreDetails, setShowMoreDetails] = useState(false);
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
      <div className={classes.studentDetailsCard}>
        <div
          className={classes.urgencyLevel}
          style={{ backgroundColor: colorUrgency }}
        ></div>
        <h3 className={classes.studentName}>
          {`${student.first_name} ${student.last_name}`}
        </h3>
        <p className={classes.city}>{student.city_of_school}</p>
        <p className={classes.class}>{textClass()}</p>
      </div>

      <div className={classes.optionsCard}>
        {addStudent && (
          <div
            onClick={() => setShowEditStudent(!showEditStudent)}
            className={classes.optionCard}
          >
            <EditOutlined />
          </div>
        )}
        {deleteStudent && (
          <div
            className={classes.optionCard}
            onClick={() => setShowDeleteForm(!showDeleteForm)}
          >
            <DeleteOutlined />
          </div>
        )}
        {showDocs && (
          <div className={classes.optionCard}>
            <FileOutlined />
          </div>
        )}
        <div
          onClick={() => navigate(`/intervention/${student.student_id}`)}
          className={classes.optionCard}
        >
          <UnorderedListOutlined />
        </div>
      </div>

      <div
        onClick={() => setShowMoreDetails(!showMoreDetails)}
        className={classes.moreDetailsIcon}
        style={{ transform: showMoreDetails ? "rotate(180deg)" : "" }}
      >
        <DownOutlined />
      </div>

      {(showDeleteForm || showEditStudent) && (
        <div
          className={classes.overlay}
          onClick={() => {
            setShowDeleteForm(false);
            setShowEditStudent(false);
          }}
        ></div>
      )}

      {showMoreDetails && (
        <div className={classes.moreDetails}>
          <p className={classes.p}>{`מס' זהות: ${student.student_id}`}</p>
          <p className={classes.p}>{`שם האב: ${student.fathers_name}`}</p>
          <p className={classes.p}>{`טלפון האב: ${student.fathers_phone}`}</p>
        </div>
      )}

      {showDeleteForm && (
        <div className={classes.deleteFormArea}>
          <DeleteStudent
            getstud={getstud}
            student={student}
            setShowDeleteForm={setShowDeleteForm}
          />
        </div>
      )}

      {showEditStudent && (
        <div className={classes.editStudentArea}>
          <EditStudent
            getstud={getstud}
            setShowEditStudent={setShowEditStudent}
            student={student}
          />
        </div>
      )}
    </div>
  );
}

export default StudentCard;
