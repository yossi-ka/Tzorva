import classes from "../css/finance.module.css";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
// import { getFinance } from "../data-base/select";
import { ConfigProvider, Table } from "antd";
import AddFinance, {
  expensesArr,
  revenuesArr,
} from "./finance-comp/AddFinance";
import DeleteFinance from "./finance-comp/DeleteFinance";
import EditFinance from "./finance-comp/EditFinance";
import he_IL from "antd/lib/locale/he_IL";
import { formatDateToHebrew } from "../services/date";
import searchProps from "../services/SearchANT";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Finance() {
  const [financeToShow, setFinanceToShow] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchData = async (u) => {
    const idToken = await u.getIdToken();
    const uid = u.uid;

    try {
      const financeData = await fetch(
        `https://getfinance${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "GET",
          headers: {
            uid: uid,
            authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await financeData.json();
      const sortData = data.massage.sort((a, b) => b.time - a.time);
      sortData.forEach((e, i) => {
        e.key = i;
      });
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

    const auth = getAuth();
    onAuthStateChanged(auth, (u) => {
      fetchData(u);
    });

    document.title = "פיננסים";
  }, [navigate, user]);

  const columns = [
    {
      title: "תאריך",
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

      onFilter: (value, record) => record.type.startsWith(value),
    },
    {
      title: "סכום",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount} ₪`,
      sorter: { compare: (a, b) => a.amount - b.amount, multiple: 3 },
    },
    {
      title: "קטגוריה",
      dataIndex: "category",
      key: "category",
      filters: [
        ...revenuesArr.map((item) => ({ text: item, value: item })),
        ...expensesArr.map((item) => ({ text: item, value: item })),
      ],

      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.category.startsWith(value),
    },
    {
      title: "פרטים",
      dataIndex: "details",
      key: "details",
      ...searchProps("details", "פרטים"),
    },
    {
      title: "פעולות",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div className={classes.rowActions}>
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
        <AddFinance fetchData={fetchData} />
      </header>
      <div className={classes.financeContainer}>
        <div className={classes.financeTable} dir="rtl">
          <ConfigProvider locale={he_IL} diraction="rtl">
            <Table
              columns={columns}
              pagination={{ pageSize: 10 }}
              dataSource={financeToShow}
              bordered
              className={classes.financeTable}
              rowKey="time"
              locale={{ emptyText: "אין נתונים פיננסים" }}
            />
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}

export default Finance;
