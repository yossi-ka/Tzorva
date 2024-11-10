import classes from "../css/intervention.module.css";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { ConfigProvider, Table } from "antd";
import AddIntervention from "./intervention-comp/AddIntervention";
import DeleteIntervention from "./intervention-comp/DeleteIntervention";
import EditIntervention from "./intervention-comp/EditIntervention";
import he_IL from "antd/lib/locale/he_IL";
import getSearchColumn from "../services/SearchANT";
import { formatDateToHebrew } from "../services/date";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Intervention() {
  const [interventionToShow, setInterventionToShow] = useState([]);
  const [delete_interventions, setDelete_interventions] = useState(false);
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
        const financeData = await fetch(
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
        );
        const data = await financeData.json();
        console.log(data);

        const sortData = data.message.sort((a, b) => b.time - a.time);

        setInterventionToShow(sortData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [rest]
  );

  useEffect(() => {
    setDelete_interventions(
      user?.access_permissions?.actions?.delete_interventions === true
    );
    document.title = "טיפולים";
    const auth = getAuth();
    onAuthStateChanged(auth, (u) => {
      fetchData(u);
    });
  }, [rest, user, fetchData]);

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
          <EditIntervention intervention={record} fetchData={fetchData} />
          {delete_interventions && (
            <DeleteIntervention intervention={record} fetchData={fetchData} />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <header className={classes.interventionHeader}>
        <h1 className={classes.interventionTitle}>טיפולים</h1>
        {rest && (
          <button
            className={classes.ahowAllStudentsBtn}
            onClick={() => navigate("/intervention")}
          >
            הצג את כל התלמידים
          </button>
        )}
        <AddIntervention fetchData={fetchData} />
      </header>
      <div className={classes.interventionContainer}>
        <div className={classes.interventionTable} dir="rtl">
          <ConfigProvider locale={he_IL} diraction="rtl">
            <Table
              columns={columns}
              pagination={{ pageSize: 10 }}
              dataSource={interventionToShow}
              bordered
              className={classes.interventionTable}
              rowKey={(record) => record.time?.timestamp || record.key}
              locale={{ emptyText: "לא קיימים טיפולים" }}
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

export default Intervention;
