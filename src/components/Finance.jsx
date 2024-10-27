import classes from "../css/finance.module.css";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getFinance } from "../data-base/select";
import { Table } from "antd";
import AddFinance from "./finance-comp/AddFinance";
import DeleteFinance from "./finance-comp/DeleteFinance";
import EditFinance from "./finance-comp/EditFinance";

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

const columns = [
  {
    title: "חותמת זמן",
    dataIndex: "time",
    key: "time",
    render: (time) => formatDate(time),
  },
  { title: "סוג הפעולה", dataIndex: "type", key: "type" },
  { title: "סכום", dataIndex: "amount", key: "amount" },
  { title: "קטגוריה", dataIndex: "category", key: "category" },
  { title: "פרטים", dataIndex: "details", key: "details" },
  {
    title: "פעולות",
    dataIndex: "actions",
    key: "actions",
    render: (text, record) => (
      <div>
        <EditFinance finance={record} />
        <DeleteFinance />
      </div>
    ),
  },
];

function Finance() {
  const [finance, setFinance] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getFinance();
      setFinance(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const access_permissions = user?.access_permissions;
    if (access_permissions?.finance === false) {
      navigate(-1);
      return;
    }

    // אם למשתמש יש גישה, טען את נתוני הפיננסים
    document.title = "פיננסים";

    fetchData();
  }, [navigate, user]);

  // הצגת טעינה או הודעת שגיאה עד שהמשתמש נטען במלואו
  if (!user) {
    return <div>טוען נתוני משתמש...</div>;
  }

  return (
    <>
      <header className={classes.financeHeader}>
        <h1 className={classes.financeTitle}>נתוני פיננסים</h1>
        <AddFinance fetchData={fetchData} />
      </header>
      <div className={classes.financeContainer}>
        <div className={classes.financeTable}>
          <Table
            columns={columns}
            pagination={{ pageSize: 10 }}
            dataSource={finance}
            bordered
            className={classes.financeTable}
            rowKey="time"
            locale={{ emptyText: "אין נתונים פיננסים" }}
          />
        </div>
      </div>
    </>
  );
}

export default Finance;
