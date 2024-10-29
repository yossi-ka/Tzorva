import classes from "../../css/different.module.css";
import React, { useState } from "react";

function SortStudents({ allStudents, setStudentsToShow }) {
  const [sortOption, setSortOption] = useState("");

  const handleSort = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedStudents = [...allStudents]; // שמירה על רשימה מנותקת מהמקור

    switch (option) {
      case "first_name":
        sortedStudents.sort((a, b) => a.first_name.localeCompare(b.first_name));
        break;
      case "last_name":
        sortedStudents.sort((a, b) => a.last_name.localeCompare(b.last_name));
        break;
      case "urgency_level":
        const urgencyMap = {
          גבוה: 1,
          בינוני: 2,
          נמוך: 3,
        };

        sortedStudents.sort(
          (a, b) => urgencyMap[a.urgency_level] - urgencyMap[b.urgency_level]
        );
        break;
      case "no":
        sortedStudents = allStudents; // ברירת מחדל: ללא מיון
        break;
      case "city":
        sortedStudents.sort((a, b) =>
          a.city_of_school.localeCompare(b.city_of_school)
        );
        break;
      default:
        break;
    }

    setStudentsToShow(sortedStudents);
  };

  return (
    <div>
      <select
        className={classes.select}
        name="sortOptions"
        id="sortOptions"
        value={sortOption}
        onChange={handleSort}
      >
        <option className={classes.option} value="no">
          -- רשימה לא ממויינת --
        </option>
        <option className={classes.option} value="first_name">
          שם פרטי
        </option>
        <option className={classes.option} value="last_name">
          שם משפחה
        </option>
        <option className={classes.option} value="city">
          עיר
        </option>
        <option className={classes.option} value="urgency_level">
          רמת דחיפות
        </option>
      </select>
    </div>
  );
}

export default SortStudents;
