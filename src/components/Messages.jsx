import classes from "../css/messages.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { UserContext } from "../App";
import { useNotification } from "./message-comp/NotificationContext";
import { formatTime } from "../services/date";
import SendMessage from "./message-comp/SendMessage";

function Messages() {
  const { user } = useContext(UserContext);
  const { setNotifNum } = useNotification();
  const [coworkers, setCoworkers] = useState([]); //  רשימת אנשי הקשר שאיתם כבר קיים איטראציה
  const [allMessages, setAllMessages] = useState([]);
  const [messages, setMessages] = useState([]); //  רשימת ההודעות להצגה
  const [currentCoworker, setCurrentCoworker] = useState(""); //  המשתמש הנוכחי איתו מקיים איטראציה

  const fetchData = useCallback(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      try {
        fetch(
          `https://getmessages${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
          {
            method: "GET",
            headers: {
              uid: u.uid,
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((d) => {
            setAllMessages(d.message);

            const coworkersArr = [];
            const unreadMessages = {}; //  מפתח = שם איש קשר, ערך = true אם הודעה לא נקראה

            d.message.forEach((m) => {
              if (
                !coworkersArr.some(
                  (coworker) => coworker.name === m.iterator_name
                )
              ) {
                coworkersArr.push({
                  name: m.iterator_name,
                  id: m.from === user.user_id ? m.to : m.from,
                });
              }

              // שמירת מידע על הודעות שלא נקראו
              if (m.is_read === false) {
                unreadMessages[m.iterator_name] = true;
              }
            });

            // מיון אנשי קשר - עם הודעות שלא נקראו ראשונים
            const sortedCoworkers = coworkersArr.sort((a, b) => {
              if (unreadMessages[a.name] && !unreadMessages[b.name]) return -1;
              if (!unreadMessages[a.name] && unreadMessages[b.name]) return 1;
              return 0;
            });

            setCoworkers(sortedCoworkers);
          });
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
    });
  }, [user]);

  const updateMessage = (messArrToUpdate) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      try {
        fetch(
          `https://editmessage${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
          {
            method: "PUT",
            headers: {
              uid: u.uid,
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messArrToUpdate),
          }
        )
          .then((res) => res.json())
          .then((d) => {
            console.log(d.message);
          });
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
    });
  };

  const sortMessages = (co) => {
    const name = co.name;
    let filteredArr = [];
    allMessages.forEach((mes) => {
      if (mes.iterator_name === name) {
        filteredArr.push(mes);
      }
    });

   filteredArr.sort((a, b) => {
      const dateA = new Date((a.sent_time._seconds || a.sent_time.seconds) * 1000);
      const dateB = new Date((b.sent_time._seconds || b.sent_time.seconds) * 1000);
      console.log("dateA", dateA, "dateB", dateB);
      return dateA - dateB;
    });

    const currentTime = new Date();

    //  בודק אם יש עדכונים לשליחה
    const messArrToUpdate = filteredArr
      .filter((m) => m.is_read === false && m.to === user.user_id)
      .map((m) => ({
        id: m.id,
        user_id: user.user_id,
        is_read: true,
        read_time: currentTime,
      }));

    if (messArrToUpdate.length > 0) {
      setNotifNum((prev) => prev - messArrToUpdate.length);
      updateMessage(messArrToUpdate);
    }

    setMessages(filteredArr);
    setCurrentCoworker(co);
  };

  useEffect(() => {
    document.title = "מערכת ההודעות של צורבא";
    fetchData();
  }, [fetchData]);

  return (
    <div className={classes.messagesContainer}>
      <h1 className={classes.h1Mess}>ברוכים הבאים למערכת ההודעות של צורבא</h1>
      <div className={classes.messContainer}>
        <aside>
          {coworkers.map((co, i) => {
            return (
              <div
                className={`${classes.coworker} ${
                  currentCoworker === co ? classes.selectedCoworker : ""
                }`}
                key={i}
                onClick={() => sortMessages(co)}
              >
                {co.name}
              </div>
            );
          })}
        </aside>
        <main>
          <div className={classes.messContent}>
            {messages.map((mes, i) => {
              return (
                <div
                  className={`${classes.mess} ${
                    mes.from === user.user_id ? classes.from : classes.to
                  }`}
                  key={i}
                >
                  {mes.content}
                  <div className={classes.date}>
                    {formatTime(mes.sent_time)}
                  </div>
                </div>
              );
            })}
          </div>
          <SendMessage
            fetchData={fetchData}
            currentCoworker={currentCoworker}
          />
        </main>
      </div>
    </div>
  );
}

export default Messages;
