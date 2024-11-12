import { getAuth, onAuthStateChanged } from "firebase/auth";
import classes from "../../css/messages.module.css";
import React, { useRef } from "react";

function SendMessage({ currentCoworker, fetchData }) {
  const messageRef = useRef();

  const handleSneMessage = async () => {
    if (messageRef.current.value === "") return;

    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      await fetch(
        `https://sendmessage${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            uid: u.uid,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: messageRef.current.value,
            to: { id: currentCoworker.id, name: currentCoworker.name },
          }),
        }
      ).then(() => {
        fetchData();
        messageRef.current.value = "";
      });
    });
  };

  return (
    <div className={classes.messSend}>
      <input
        disabled={!currentCoworker}
        className={classes.sendContent}
        ref={messageRef}
      ></input>
      <button onClick={handleSneMessage} className="material-symbols-outlined">
        send
      </button>
    </div>
  );
}

export default SendMessage;
