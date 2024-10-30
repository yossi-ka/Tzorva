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
import searchProps from "../services/SearchANT";
import { formatDate, formatDateToHebrew } from "../services/date";

function Intervention() {
  const [interventionToShow, setInterventionToShow] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { "*": rest } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const data = await getIntervention(user, rest);
      const sortData = data?.sort((a, b) => b.time - a.time);
      setInterventionToShow(sortData);
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
      title: "חותמת זמן",
      dataIndex: "time",
      key: "time",
      render: (time) => formatDate(time),
    },
    {
      title: "תאריך טיפול",
      dataIndex: "date",
      key: "hebrewDate",
      render: (date) => formatDateToHebrew(date),
    },
    ...(user.job_title === "יועץ" ||
    user.job_title === "מנהל ארגון" ||
    user.job_title === `מנהל ת"ת`
      ? [
          {
            title: "מטפל",
            dataIndex: "tutor_name",
            key: "tutor_name",
            ...searchProps("tutor_name", "מטפל"),
            sorter: (a, b) => a.tutor_name.localeCompare(b.tutor_name),
          },
        ]
      : []),
    {
      title: "תלמיד",
      dataIndex: "student_name",
      key: "student_name",
      ...searchProps("student_name", "תלמיד"),
      sorter: (a, b) => a.student_name.localeCompare(b.student_name),
    },
    {
      title: "מקום מפגש",
      dataIndex: "place",
      key: "place",
      ...searchProps("place", "מקום מפגש"),
    },
    {
      title: "נושא טיפול",
      dataIndex: "intervention_title",
      key: "intervention_title",
      ...searchProps("intervention_title", "נושא טיפול"),
    },
    {
      title: "פעולות",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div className={classes.rowActions}>
          <EditIntervention intervention={record} fetchData={fetchData} />
          <DeleteIntervention intervention={record} fetchData={fetchData} />
        </div>
      ),
    },
  ];

  return (
    <>
      <header className={classes.interventionHeader}>
        <h1 className={classes.interventionTitle}>טיפולים</h1>
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
