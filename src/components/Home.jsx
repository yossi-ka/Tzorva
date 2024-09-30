import classes from "../css/home.module.css";
import React, { useEffect} from "react";

function Home() {

  useEffect(() => {
    document.title = "צורבא - דף הבית";
  }, []);
  return (
    <div className={classes.container}>
    </div>
  );
}

export default Home;
