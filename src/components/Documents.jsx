import classes from "../css/documents.module.css";
import React, { useCallback, useEffect, useState } from "react";
import AddDoc from "./documents-comp/AddDoc";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { LinearProgress } from "@mui/material";
import DocumentCard from "./documents-comp/DocumentCard";

function Documents({ studentName, studentId, setOpenDocs }) {
  const [openAddForm, setOpenAddForm] = useState(false);
  const [docs, setDocs] = useState([]);

  const fetchData = useCallback(async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const idToken = await u.getIdToken();

      await fetch(
        `https://getdocuments${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "GET",
          headers: {
            uid: u.uid,
            authorization: `Bearer ${idToken}`,
            student_id: studentId,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((d) => {
          setDocs(d.message);
        });
    });
  }, [studentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div
        onClick={() => setOpenDocs(false)}
        className={classes.docsOverlay}
      ></div>
      <div className={classes.documentsArea}>
        <header>
          <h2>מסמכים - {studentName}</h2>
          <button onClick={() => setOpenAddForm(true)}>+ הוספת מסמך</button>
        </header>

        {docs.length > 0 ? (
          docs.map((doc, i) => (
            <DocumentCard fetchData={fetchData} doc={doc} key={i} />
          ))
        ) : (
          <LinearProgress />
        )}

        {openAddForm && (
          <AddDoc
            fetchData={fetchData}
            setOpenAddForm={setOpenAddForm}
            studentId={studentId}
          />
        )}
      </div>
    </>
  );
}

export default Documents;
