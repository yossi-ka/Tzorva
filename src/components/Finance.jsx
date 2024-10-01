import React, { useEffect } from "react";

function Finance() {
  useEffect(() => {
    document.title = "פיננסים";
  }, []);
  return <div>Finance</div>;
}

export default Finance;
