import classes from "../css/intervention.module.css";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { getIntervention } from "../data-base/select";
import { ConfigProvider, Table } from "antd";
import AddIntervention from "./intervention-comp/AddIntervention";
import DeleteIntervention from "./intervention-comp/DeleteIntervention";
import EditIntervention from "./intervention-comp/EditIntervention";
import he_IL from "antd/lib/locale/he_IL";
import getSearchColumn from "../services/SearchANT";
import { formatDateToHebrew } from "../services/date";

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

  const fetchData = useCallback(async () => {
    try {
      const data = await getIntervention(user, rest);
      const sortData = data.sort((a, b) => b.time - a.time);
      sortData.forEach((e, i) => {
        e.key = i;
      });
      setInterventionToShow(sortData);
      setDelete_interventions(
        user?.access_permissions?.actions?.delete_interventions
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [user, rest]);

  useEffect(() => {
    document.title = "טיפולים";
    fetchData();
  }, [navigate, user, fetchData]);

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
              rowKey="time"
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
