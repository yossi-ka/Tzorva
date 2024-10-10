import classes from "../css/different.module.css";
import React, { useState } from "react";

function SearchField({ allItems, itemsToShow, setItemsToShow, placeholder }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchNotFound, setSearchNotFound] = useState(false);
  const handleSearch = (e) => {
    setSearchNotFound(false);

    const query = e.target.value;
    setSearchQuery(query); // עדכון ה-state לפני החיפוש
    console.log(query);

    console.log(itemsToShow);

    if (!query) {
      setItemsToShow(allItems); // אם אין ערך, הצג את כל הפריטים
      return;
    }

    const filteredItems = allItems.filter(
      (item) =>
        item.first_name.includes(query) || item.last_name.includes(query)
    );
    setItemsToShow(filteredItems);

    if (!filteredItems.length) {
      setSearchNotFound(true);
    } else {
    }
  };

  return (
    <div className={classes.searchFieldContainer}>
      <input
        className={classes.searchField}
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder={`${placeholder} ...`}
      />

      {searchNotFound && (
        <div className={classes.SearchotFound}>אין תוצאות חיפוש</div>
      )}
    </div>
  );
}

export default SearchField;
