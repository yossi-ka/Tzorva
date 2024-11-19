import classes from "../../css/documents.module.css";
import React, { useRef, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../data-base/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function AddDoc({ studentId, setOpenAddForm, fetchData }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const decriptionRef = useRef();
  const storage = getStorage(app);

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log("No file selected");
      return;
    }

    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();
      setUploading(true); // מצב העלאה
      const storageRef = ref(storage, `documents/${file.name}`);
      try {
        // בדיקה אם אובייקט storageRef לא undefined
        if (storageRef && file) {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          setUploading(false);
          console.log("File uploaded:", downloadURL);

          await fetch(
            `https://adddocument${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
                uid: u.uid,
              },
              body: JSON.stringify({
                student_id: studentId,
                URL: downloadURL,
                description: decriptionRef.current.value,
              }),
            }
          ).then(() => fetchData());
        } else {
          console.error("Error: Invalid file or storage reference");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
      }
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className={classes.addDocArea}>
      <div
        onClick={() => setOpenAddForm(false)}
        className={classes.addOverlay}
      ></div>
      <form onSubmit={uploadFile} className={classes.addDocForm}>
        <h2>הוספת מסמך</h2>
        <label htmlFor="description">תיאור המסמך:</label>
        <input
          required
          type="text"
          id="description"
          ref={decriptionRef}
          placeholder="תיאור המסמך"
        />

        <input
          required
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
        />

        <button disabled={uploading || !file}>
          {uploading ? "מוסיף..." : "הוסף"}
        </button>
      </form>
    </div>
  );
}

export default AddDoc;
