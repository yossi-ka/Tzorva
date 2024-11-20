import { getAuth, onAuthStateChanged } from "firebase/auth";
import classes from "../../css/documents.module.css";
import React from "react";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../../data-base/config";

function DeleteDoc({ setOpenDelete, url, fetchData }) {
  const handleDeleteDoc = () => {
    setOpenDelete(false);
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      await fetch(
        `https://deletedocument${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "PUT",
          headers: {
            uid: u.uid,
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: url }),
        }
      )
        .then((res) => {
          res.json();

          deleteFileFromStorage(url);
        })
        .then(() => fetchData());
    });
  };

  const deleteFileFromStorage = async (url) => {
    const storage = getStorage(app);
    try {
      const parts = url.split("/");
      const encodedFileName = parts[parts.length - 1].split("?")[0];
      const fileName = decodeURIComponent(encodedFileName);
      const fileRef = ref(storage, fileName);
      await deleteObject(fileRef);

      console.log("קובץ נמחק בהצלחה");
    } catch (error) {
      console.error("שגיאה במחיקת קובץ:", error);
    }
  };

  return (
    <div className={classes.deleteDocArea}>
      <div
        onClick={() => setOpenDelete(false)}
        className={classes.overlayDelete}
      ></div>
      <div className={classes.deleteDoc}>
        <h1>האם אתה בטוח שברצונך למחוק את המסמך?</h1>
        <div className={classes.deleteDocBtns}>
          <button onClick={handleDeleteDoc}>כן</button>
          <button onClick={() => setOpenDelete(false)}>לא</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteDoc;
