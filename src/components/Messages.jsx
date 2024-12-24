import classes from "../css/messages.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import { UserContext } from "../App";
import { useNotification } from "./message-comp/NotificationContext";
import { formatTime } from "../services/date";
import SendMessage from "./message-comp/SendMessage";
import { CircularProgress } from "@mui/material";

function Messages() {
  const { user } = useContext(UserContext);
  const { notifNum, setNotifNum } = useNotification();
  const [coworkers, setCoworkers] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentCoworker, setCurrentCoworker] = useState("");
  const [loadingCoworkers, setLoadingCoworkers] = useState(false); //loadingCoworkers

  const userRef = useRef();
  const currentCoworkerRef = useRef();
  const isFirstRender = useRef(true);
  const messagesRef = useRef(null);

  const updateMessage = useCallback((messArrToUpdate) => {
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
        ).then((res) => res.json());
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
    });
  }, []);

  const sortMessages = useCallback(
    (co) => {
      const name = co.name;
      let filteredArr = [];
      allMessages.forEach((mes) => {
        if (mes.to.name === name || mes.from.name === name) {
          filteredArr.push(mes);
        }
      });

      filteredArr.sort((a, b) => {
        const dateA = new Date(
          (a.sent_time._seconds || a.sent_time.seconds) * 1000
        );
        const dateB = new Date(
          (b.sent_time._seconds || b.sent_time.seconds) * 1000
        );
        return dateA - dateB;
      });

      const currentTime = new Date();

      const messArrToUpdate = filteredArr
        .filter(
          (m) => m.is_read === false && m.to.id === userRef.current.user_id
        )
        .map((m) => ({
          id: m.id,
          user_id: userRef.current.user_id,
          is_read: true,
          read_time: currentTime,
        }));

      if (messArrToUpdate.length > 0) {
        if (notifNum > 0) {
          setNotifNum((prev) => prev - messArrToUpdate.length);
        }
        updateMessage(messArrToUpdate);
      }
      setMessages(filteredArr);
      setCurrentCoworker(co);
    },
    [allMessages, setNotifNum, updateMessage, notifNum]
  );

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
          .then(async (res) => await res.json())
          .then((d) => {
            const coworkersArr = [];
            const unreadMessages = {};

            setAllMessages(d.message);

            d.message.forEach((m) => {
              const userName = `${userRef.current.first_name} ${userRef.current.last_name}`;

              // בדיקה אם המידע של `from` או `to` כבר קיימים ברשימה
              const mTo = coworkersArr.find(
                (coworker) =>
                  coworker.name === m.to.name && coworker.id === m.to.id
              );
              const mFrom = coworkersArr.find(
                (coworker) =>
                  coworker.name === m.from.name && coworker.id === m.from.id
              );

              // אם אף אחד מהם לא קיים, נוסיף את המשתמש המתאים לפי מזהה המשתמש הנוכחי
              if (!(mTo || mFrom)) {
                coworkersArr.push({
                  name: m.from.name === userName ? m.to.name : m.from.name,
                  id:
                    m.from.id === userRef.current.user_id ? m.to.id : m.from.id,
                });
              }

              // בדיקה אם ההודעה לא נקראה, כדי להוסיף אותה לרשימת הודעות שלא נקראו
              if (!m.is_read) {
                unreadMessages[
                  m.from.name === userName ? m.to.name : m.from.name
                ] = true;
              }
            });

            const sortedCoworkers = coworkersArr.sort((a, b) => {
              if (unreadMessages[a.name] && !unreadMessages[b.name]) return -1;
              if (!unreadMessages[a.name] && unreadMessages[b.name]) return 1;
              return 0;
            });
            setLoadingCoworkers(false);
            setCoworkers(sortedCoworkers);

            if (currentCoworkerRef.current) {
              sortMessages(currentCoworkerRef.current);
            }
          });
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
    });
  }, [sortMessages]);

  const handleSelectCoworker = (co) => {
    setCurrentCoworker(co);
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currentCoworker) {
      sortMessages(currentCoworker);
    }
  }, [currentCoworker, sortMessages]);

  useEffect(() => {
    if (!user) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData();
    }
  }, [fetchData, user]);

  useEffect(() => {
    userRef.current = user;
    currentCoworkerRef.current = currentCoworker;
  }, [user, currentCoworker]);

  useEffect(() => {
    document.title = "צורבא - הודעות";
    setLoadingCoworkers(true);
  }, []);

  return (
    <div className={classes.messagesContainer}>
      <h1 className={classes.h1Mess}>ברוכים הבאים למערכת ההודעות של צורבא</h1>
      <p className={classes.pMess}>
        שימו לב! הודעות שנקראו לפני 14 ימים יימחקו באופן אוטומטי.
      </p>
      <div className={classes.messContainer}>
        <aside>
          {loadingCoworkers && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress color="inherit" size={30} sx={{ m: 2 }} />
            </div>
          )}
          {coworkers.map((co, i) => {
            return (
              <div
                className={`${classes.coworker} ${
                  currentCoworker === co ? classes.selectedCoworker : ""
                }`}
                key={i}
                onClick={() => handleSelectCoworker(co)}
              >
                {co.name}
              </div>
            );
          })}
        </aside>
        <main>
          <div className={classes.messContent} ref={messagesRef}>
            {messages.map((mes, i) => {
              return (
                <div
                  className={`${classes.mess} ${
                    mes.from.id === user.user_id ? classes.from : classes.to
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
