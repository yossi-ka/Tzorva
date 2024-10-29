import classes from "../css/intervention.module.css";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { getIntervention } from "../data-base/select";
import { ConfigProvider, Table } from "antd";
import AddIntervention from "./intervention-comp/AddIntervention";
import DeleteIntervention from "./intervention-comp/DeleteIntervention";
import EditIntervention from "./intervention-comp/EditIntervention";
import Hebcal from "hebcal";
import SearchField from "./SearchField";
import he_IL from "antd/lib/locale/he_IL";

const formatDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDateToHebrew = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const hebrewDate = new Hebcal.HDate(date);
  return hebrewDate.toString("h"); // "h" מציין את הפורמט העברי
};

function Intervention() {
  const [intervention, setIntervention] = useState([]);
  const [interventionToShow, setInterventionToShow] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { "*": rest } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const data = await getIntervention(user, rest);
      const sortData = data?.sort((a, b) => b.time - a.time);
      setIntervention(sortData);
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
          },
        ]
      : []),
    {
      title: "תלמיד",
      dataIndex: "student_name",
      key: "student_name",
    },
    {
      title: "מקום מפגש",
      dataIndex: "place",
      key: "place",
    },
    {
      title: "נושא טיפול",
      dataIndex: "intervention_title",
      key: "intervention_title",
    },
    {
      title: "פרטי התקדמות",
      dataIndex: "intervention_description",
      key: "intervention_description",
    },
    {
      title: "פעולות",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div className={classes.rowActions}>
          <EditIntervention fetchData={fetchData} intervention={record} />
          <DeleteIntervention fetchData={fetchData} intervention={record} />
        </div>
      ),
    },
  ];

  return (
    <>
      <header className={classes.interventionHeader}>
        <h1 className={classes.interventionTitle}>טיפולים</h1>
        <SearchField
          allItems={intervention}
          setItemsToShow={setInterventionToShow}
          placeholder={"חיפוש לפי שם תלמיד"}
        />
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
            />
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}

export default Intervention;
