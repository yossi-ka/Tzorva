import classes from "../css/different.module.css";
import { FileExcelOutlined } from "@ant-design/icons";
import React from "react";
import * as XLSX from "xlsx";

function ExportToExcel({ items, data , fileName }) {
  // פונקציה לייצוא לאקסל
  const createExcel = () => {
    if (!items || items.length === 0) {
      console.error("אין נתונים לייצוא לאקסל.");
      return;
    }

    // יצירת sheet מ-array של אובייקטים
    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, data);

    // שמירת הקובץ כ-`fileName`
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <button className={classes.exportExcel} onClick={createExcel}>
      <FileExcelOutlined /> יצוא לאקסל
    </button>
  );
}

export default ExportToExcel;
