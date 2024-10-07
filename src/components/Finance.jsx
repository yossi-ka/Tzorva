import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

function Finance() {
  const rows = [
    { id: 1, col1: "הוצאה", col2: 1500.0 },
    { id: 2, col1: "הוצאה", col2: 748.0 },
    { id: 3, col1: "הכנסה", col2: 4850.4 },
    { id: 4, col1: "הכנסה", col2: 1500.0 },
  ];

  const columns = [
    { field: "col1", headerName: "סוג הפעולה", width: 150 },
    { field: "col2", headerName: "סכום", width: 150 },
  ];
  useEffect(() => {
    document.title = "פיננסים";
  }, []);
  return (
    <div>
      <div style={{ height: 300, width: "1000px" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
}

export default Finance;
