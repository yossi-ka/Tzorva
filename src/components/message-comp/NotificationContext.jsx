import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifNum, setNotifNum] = useState(0);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      await fetch(
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
          const unreadMessages = d.message.filter(
            (msg) => msg?.is_read === false && msg?.to.id === user.user_id
          );

          setNotifNum(unreadMessages.length);
        })
        .catch((error) => console.error("Error fetching messages:", error));
    });
  }, [user.user_id]);

  return (
    <NotificationContext.Provider value={{ notifNum, setNotifNum }}>
      {children}
    </NotificationContext.Provider>
  );
};
