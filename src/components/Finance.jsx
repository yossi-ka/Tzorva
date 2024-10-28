import classes from "../css/finance.module.css";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getFinance } from "../data-base/select";
import { Table } from "antd";
import AddFinance from "./finance-comp/AddFinance";
import DeleteFinance from "./finance-comp/DeleteFinance";
import EditFinance from "./finance-comp/EditFinance";
import Hebcal from "hebcal";
import SearchField from "./SearchField";

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

function Finance() {
  const [finance, setFinance] = useState([]);
  const [financeToShow, setFinanceToShow] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getFinance();
      const sortData = data.sort((a, b) => b.time - a.time);
      setFinance(sortData);
      setFinanceToShow(sortData);
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
      title: "סוג הפעולה",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "הכנסה", value: "הכנסה" },
        { text: "הוצאה", value: "הוצאה" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
    },
    {
      title: "סכום",
      dataIndex: "amount",
      key: "amount",
      sorter: { compare: (a, b) => a.amount - b.amount, multiple: 3 },
    },
    { title: "קטגוריה", dataIndex: "category", key: "category" },
    { title: "פרטים", dataIndex: "details", key: "details" },
    {
      title: "פעולות",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <EditFinance fetchData={fetchData} finance={record} />
          <DeleteFinance fetchData={fetchData} finance={record} />
        </div>
      ),
    },
  ];

  return (
    <>
      <header className={classes.financeHeader}>
        <h1 className={classes.financeTitle}>ניהול פיננסים</h1>
        <SearchField
          allItems={finance}
          setItemsToShow={setFinanceToShow}
          placeholder={`חיפוש עפ"י פרטים`}
        />
        <AddFinance fetchData={fetchData} />
      </header>
      <div className={classes.financeContainer}>
        <div className={classes.financeTable}>
          <Table
            columns={columns}
            pagination={{ pageSize: 10 }}
            dataSource={financeToShow}
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
