import classes from "../css/archive.module.css";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Table } from "antd";
import AddArchive, { statusArr } from "./archive-comp/AddArchive";
import he_IL from "antd/lib/locale/he_IL";
import EditArchive from "./archive-comp/EditArchive";
import DeleteArchive from "./archive-comp/DeleteArchive";
import { formatDateToHebrew } from "../services/date";
import searchProps from "../services/SearchANT";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Archive() {
  const [archiveToShow, setArchiveToShow] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchData = async (u) => {
    const idToken = await u.getIdToken();
    const uid = u.uid;
    try {
      const archiveData = await fetch(
        `https://getarchive${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "GET",
          headers: {
            uid: uid,
            authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await archiveData.json();
      const sortData = data.message.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );

      setArchiveToShow(sortData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const access_permissions = user?.access_permissions;
    if (access_permissions?.archive === false) {
      navigate("/home");
      return;
    }

    const auth = getAuth();
    onAuthStateChanged(auth, (u) => {
      fetchData(u);
    });
    document.title = "ארכיון";
  }, [navigate, user]);

  const columns = [
    {
      title: "תאריך",
      dataIndex: "time",
      key: "time",
      render: (time) => formatDateToHebrew(time),
      sorter: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    },
    {
      title: "מספר זהות",
      dataIndex: "student_id",
      key: "student_id",
    },
    {
      title: "שם התלמיד",
      dataIndex: "full_name",
      key: "full_name",
      ...searchProps("full_name", "שם התלמיד"),
    },
    {
      title: "שם האב",
      dataIndex: "fathers_name",
      key: "fathers_name",
    },
    {
      title: "סך הוצאות",
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
              rowKey={(record) => record.student_id}
              locale={{ emptyText: "לא קיימים תיעודים" }}
              expandable={{
                expandedRowRender: (record) => (
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    {record.body}
                  </p>
                ),
                rowExpandable: (record) =>
                  record.body !== "***  לא קיים תיעוד  ***",
              }}
            />
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}

export default Archive;
