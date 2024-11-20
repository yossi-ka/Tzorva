import classes from "../../css/documents.module.css";
import React, { useState } from "react";
import DeleteDoc from "./DeleteDoc";
import EditDoc from "./EditDoc";

function DocumentCard({ doc, i, fetchData }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <>
      <a
        target="_blank"
        rel="noreferrer"
        href={doc.URL}
        key={i}
        className={classes.doc}
      >
        <span className="material-symbols-outlined">open_in_new</span>
        <h3>{doc.description}</h3>
        <div className={classes.options}>
          <span
            onClick={(e) => {
              e.stopPropagation(); // מונע התפשטות
              e.preventDefault();
              setOpenDelete(true);
            }}
            style={{ color: "#ee8585" }}
            className="material-symbols-outlined"
          >
            delete
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation(); // מונע התפשטות
              e.preventDefault();
              setOpenEdit(true);
            }}
            style={{ color: "#f1c40f" }}
            className="material-symbols-outlined"
          >
            edit
          </span>
        </div>
      </a>
      {openDelete && (
        <DeleteDoc url={doc.URL} fetchData={fetchData} setOpenDelete={setOpenDelete} />
      )}
      {openEdit && (
        <EditDoc fetchData={fetchData} setOpenEdit={setOpenEdit} />
      )}
    </>
  );
}

export default DocumentCard;
