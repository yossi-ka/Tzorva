import classes from "../css/treatment.module.css";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { ConfigProvider, Table } from "antd";
import AddTreatments from "./treatments-comp/AddTreatments";
import DeleteTreatment from "./treatments-comp/DeleteTreatments";
import EditTreatment from "./treatments-comp/EditTreatments";
import he_IL from "antd/lib/locale/he_IL";
import getSearchColumn from "../services/SearchANT";
import { formatDateToHebrew } from "../services/date";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ExportToExcel from "../services/ExportToExcel";
import { CircularProgress } from "@mui/material";

function Treatments() {
  const [treatmentsToShow, setTreatmentsToShow] = useState([]);
  const [delete_treatments, setDelete_treatments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const manager =
    user.job_title === "יועץ" ||
    user.job_title === "מנהל ארגון" ||
    user.job_title === `מנהל ת"ת`;

  const navigate = useNavigate();
  const { "*": rest } = useParams();
  if (
    rest &&
    user?.access_permissions?.students.includes(rest) === false &&
    !manager
  ) {
    navigate("/home");
  }

  const fetchData = useCallback(
    async (u) => {
      const idToken = await u.getIdToken();
      const uid = u.uid;

      try {
        await fetch(
          `https://getinterventions${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
          {
            method: "GET",
            headers: {
              uid: uid,
              authorization: `Bearer ${idToken}`,
              rest: rest,
              "Content-Type": "application/json",
            },
          }
        ).then(async (res) => {
          const data = await res.json();
          const sortData = data.message.sort((a, b) => b.time - a.time);
          setLoading(false);
          setTreatmentsToShow(sortData);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [rest]
  );

  useEffect(() => {
    setDelete_treatments(
      user?.access_permissions?.actions?.delete_interventions === true
    );
    document.title = "טיפולים";
    const auth = getAuth();
    onAuthStateChanged(auth, (u) => {
      fetchData(u);
    });
  }, [rest, user, fetchData]);

  useEffect(() => {
    setLoading(true);
  }, []);

  const columns = [
    {
      title: "תאריך טיפול",
      dataIndex: "date",
      key: "hebrewDate",
      render: (date) => formatDateToHebrew(date),
    },
    ...(manager
      ? [
          {
            title: "מטפל",
            dataIndex: "tutor_name",
            key: "tutor_name",
            ...getSearchColumn("tutor_name", "מטפל"),
            sorter: (a, b) => a.tutor_name.localeCompare(b.tutor_name),
          },
        ]
      : []),
    {
      title: "תלמיד",
      dataIndex: "student_name",
      key: "student_name",
      ...getSearchColumn("student_name", "תלמיד"),
      sorter: (a, b) => a.student_name.localeCompare(b.student_name),
    },
    {
      title: "מקום מפגש",
      dataIndex: "place",
      key: "place",
      ...getSearchColumn("place", "מקום מפגש"),
    },
    {
      title: "נושא טיפול",
      dataIndex: "intervention_title",
      key: "intervention_title",
      ...getSearchColumn("intervention_title", "נושא טיפול"),
    },
    {
      title: "פעולות",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div className={classes.rowActions}>
          <EditTreatment treatment={record} fetchData={fetchData} />
          {delete_treatments && (
            <DeleteTreatment treatment={record} fetchData={fetchData} />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <header className={classes.treatmentHeader}>
        <h1 className={classes.treatmentTitle}>טיפולים</h1>
        {rest && (
          <button
            className={classes.ahowAllStudentsBtn}
            onClick={() => navigate("/treatments")}
          >
            הצג את כל התלמידים
          </button>
        )}
        {treatmentsToShow.length > 0 && (
          <ExportToExcel
            items={treatmentsToShow}
            data="treatments data"
            fileName="treatments-tzorva.xlsx"
          />
        )}
        <AddTreatments fetchData={fetchData} />
      </header>
      <div className={classes.treatmentContainer}>
        <div className={classes.treatmentTable} dir="rtl">
          <ConfigProvider locale={he_IL} diraction="rtl">
            <Table
              columns={columns}
              pagination={{ pageSize: 10 }}
              dataSource={treatmentsToShow}
              bordered
              rowKey={(record) => record.id}
              locale={{
                emptyText: loading ? <CircularProgress /> : "לא קיימים טיפולים",
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    {record.intervention_description}
                  </p>
                ),
                rowExpandable: (record) =>
                  record.intervention_description !== "***  לא קיים תיעוד  ***",
              }}
            />
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}

export default Treatments;
