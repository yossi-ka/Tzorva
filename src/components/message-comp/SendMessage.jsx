import { getAuth, onAuthStateChanged } from "firebase/auth";
import classes from "../../css/messages.module.css";
import React, { useRef, useState } from "react";
import SnackbarMUI from "../../services/SnackbarMUI";

function SendMessage({ currentCoworker, fetchData }) {
  const messageRef = useRef();
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");

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
      ).then((res) => {
        if (res.ok) {
          messageRef.current.value = "";
          setMessags("ההודעה נשלחה בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          fetchData();
        } else {
          setMessags("שגיאה, אנא נסה שוב");
          setState("error");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
        }
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
      {openAlert && <SnackbarMUI state={state} message={messags} />}
    </div>
  );
}

export default SendMessage;
