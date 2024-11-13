import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

function SnackbarMUI({ state, message }) {
  const [openSuccessSB, setOpenSuccessSB] = useState(false);
  const [openErrorSB, setOpenErrorSB] = useState(false);
  useEffect(() => {
    if (state === "success") {
      setOpenSuccessSB(true);
    } else if (state === "error") {
      setOpenErrorSB(true);
    }
  }, [state]);
  return (
    <div>
      {openSuccessSB && (
        <Snackbar
          anchorOrigin={{ vertical: "down", horizontal: "right" }}
          open={openSuccessSB}
          autoHideDuration={4000}
          onClose={() => setOpenSuccessSB(false)}
        >
          <Alert
            onClose={() => setOpenSuccessSB(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
      {openErrorSB && (
        <Snackbar
          anchorOrigin={{ vertical: "down", horizontal: "right" }}
          open={openSuccessSB}
          autoHideDuration={4000}
          onClose={() => setOpenErrorSB(false)}
        >
          <Alert
            onClose={() => setOpenErrorSB(false)}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default SnackbarMUI;
