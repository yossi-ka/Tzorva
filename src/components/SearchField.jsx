import classes from "../css/different.module.css";
import React, { useState } from "react";

function SearchField({ allItems, setItemsToShow, placeholder }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchNotFound, setSearchNotFound] = useState(false);
  const handleSearch = (e) => {
    setSearchNotFound(false);

    const query = e.target.value;
    setSearchQuery(query); // עדכון ה-state לפני החיפוש
    if (!query) {
      setItemsToShow(allItems); // אם אין ערך, הצג את כל הפריטים
      return;
    }

    const filteredItems = allItems.filter((item) => {
      return !item.details
        ? item.first_name.includes(query) || item.last_name.includes(query)
        : item.details.includes(query);
    });
    setItemsToShow(filteredItems);

    if (!filteredItems.length) {
      setSearchNotFound(true);
    } else {
    }
  };

  return (
    <div className={classes.searchFieldContainer}>
      <div className={classes.searchField}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={`${placeholder} ...`}
        />
        {searchQuery ? (
          <span
            style={{ cursor: "pointer" }}
            className="material-symbols-outlined"
            onClick={() => {
              setSearchQuery("");
              setItemsToShow(allItems);
              setSearchNotFound(false);
            }}
          >
            close
          </span>
        ) : (
          <span className="material-symbols-outlined">search</span>
        )}
      </div>
      {searchNotFound && (
        <div className={classes.SearchotFound}>אין תוצאות חיפוש</div>
      )}
    </div>
  );
}

export default SearchField;
