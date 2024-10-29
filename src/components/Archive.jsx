import classes from "../css/archive.module.css";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getArchive } from "../data-base/select";
import { ConfigProvider, Table } from "antd";
import AddArchive, { statusArr } from "./archive-comp/AddArchive";
import Hebcal from "hebcal";
import SearchField from "./SearchField";
import he_IL from "antd/lib/locale/he_IL";
import EditArchive from "./archive-comp/EditArchive";
import DeleteArchive from "./archive-comp/DeleteArchive";

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

function Archive() {
  const [archive, setArchive] = useState([]);
  const [archiveToShow, setArchiveToShow] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getArchive();
      const sortData = data.sort((a, b) => b.time - a.time);
      setArchive(sortData);
      setArchiveToShow(sortData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const access_permissions = user?.access_permissions;
    if (access_permissions?.archive === false) {
      navigate(-1);
      return;
    }
    // אם למשתמש יש גישה, טען את נתוני הארכיון
    document.title = "ארכיון";
    fetchData();
  }, [navigate, user]);

  const columns = [
    {
      title: "חותמת זמן",
      dataIndex: "time",
      key: "time",
      render: (time) => formatDate(time),
    },
    {
      title: "תאריך עברי",
      dataIndex: "time",
      key: "hebrewDate",
      render: (time) => formatDateToHebrew(time),
      sorter: { compare: (a, b) => a.time - b.time, multiple: 4 },
    },
    {
      title: "מספר זהות",
      dataIndex: "student_id",
      key: "student_id,",
    },
    {
      title: "שם מלא",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "שם האב",
      dataIndex: "fathers_name",
      key: "fathers_name",
    },
    {
      title: "סך הוצאות עבורו",
      dataIndex: "invested_amount",
      key: "invested_amount",
      render: (amount) => `${amount} ₪`,
      sorter: (a, b) => a.invested_amount - b.invested_amount,
    },
    {
      title: "סטטוס",
      dataIndex: "title",
      key: "title",
      filters: statusArr.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record.title === value,
      // onFilter: (value, record) => record.title.indexOf(value) === 0,
    },
    {
      title: "תיאור",
      dataIndex: "body",
      key: "body",
    },
    {
      title: "פעולות",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div className={classes.rowActions}>
          <EditArchive fetchData={fetchData} archive={record} />
          <DeleteArchive fetchData={fetchData} archive={record} />
        </div>
      ),
    },
  ];

  return (
    <>
      <header className={classes.archiveHeader}>
        <h1 className={classes.archiveTitle}>ארכיון</h1>
        <SearchField
          allItems={archive}
          setItemsToShow={setArchiveToShow}
          placeholder={`חיפוש תלמיד`}
          searchBy="name"
        />
        <SearchField
          allItems={archive}
          setItemsToShow={setArchiveToShow}
          placeholder={`חיפוש עפ"י תיאור`}
          searchBy="body"
        />
        <AddArchive fetchData={fetchData} />
      </header>
      <div className={classes.archiveContainer}>
        <div className={classes.archiveTable} dir="rtl">
          <ConfigProvider locale={he_IL} diraction="rtl">
            <Table
              columns={columns}
              pagination={{ pageSize: 10 }}
              dataSource={archiveToShow}
              bordered
              className={classes.archiveTable}
              rowKey="time"
              locale={{ emptyText: "לא קיימים תיעודים" }}
            />
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}

export default Archive;
