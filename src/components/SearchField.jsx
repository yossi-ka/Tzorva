import classes from "../css/different.module.css";
import React, { useState } from "react";

function SearchField({ allItems, setItemsToShow, placeholder, searchBy }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchNotFound, setSearchNotFound] = useState(false);
  const handleSearch = (e) => {
    setSearchNotFound(false);

    const query = e.target.value;
    setSearchQuery(query);
    if (!query) {
      setItemsToShow(allItems);
      return;
    }

    const filteredItems = allItems.filter((item) => {
      return item.first_name
        ? item.first_name.includes(query) || item.last_name.includes(query)
        : item.full_name && searchBy === "name"
        ? item.full_name.includes(query)
        : item.full_name && searchBy === "body"
        ? item.body.includes(query)
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
