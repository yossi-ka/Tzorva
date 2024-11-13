import classes from "../../css/student.module.css";
import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SnackbarMUI from "../../services/SnackbarMUI";

function AddStudentBtn({ getstud }) {
  const [city, setCity] = useState("");
  const [clas, setClas] = useState("");
  const [urgency, setUrgency] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [messags, setMessags] = useState("");
  const [state, setState] = useState("");
  const studentIdRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const fatherNameRef = useRef();
  const fatherPhoneRef = useRef();

  const [showForm, setShowForm] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();

    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      const newStudent = {
        student_id: studentIdRef.current.value,
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
        fathers_name: fatherNameRef.current.value,
        fathers_phone: fatherPhoneRef.current.value,
        city_of_school: city,
        class_school: clas,
        urgency_level: urgency,
      };
      setShowForm(false);

      const idToken = await u.getIdToken();

      await fetch(
        `https://addstudent${process.env.REACT_APP_URL_FIREBASE_FUNCTIONS}`,
        {
          method: "POST",
          headers: {
            uid: u.uid,
            authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStudent),
        }
      ).then((res) => {
        if (res.ok) {
          setMessags("התלמיד נוסף בהצלחה");
          setState("success");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
          getstud(u);
        } else {
          setMessags("שגיאה, אנא נסה שוב");
          setState("error");
          setOpenAlert(true);
          setTimeout(() => {
            setOpenAlert(false);
          }, 4000);
        }
      });
    });
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className={classes.addStudentBtn}
      >
        + הוסף תלמיד
      </button>
      {showForm && (
        <>
          <div
            className={classes.overlay}
            onClick={() => setShowForm(false)}
          ></div>
          <div className={classes.addStudentForm}>
            <form onSubmit={handleSubmit}>
              <h1 className={classes.h1}>הוספת תלמיד</h1>
              <input
                ref={studentIdRef}
                type="text"
                placeholder="תעודת זהות"
                maxLength="9"
                required
              />
              <input
                ref={firstNameRef}
                type="text"
                placeholder="שם פרטי"
                required
              />
              <input
                ref={lastNameRef}
                type="text"
                placeholder="שם משפחה"
                required
              />
              <input
                ref={fatherNameRef}
                type="text"
                placeholder="שם האב"
                required
              />
              <input
                ref={fatherPhoneRef}
                type="text"
                placeholder="טלפון האב"
                required
              />
              <Box className={classes.box}>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">בחר עיר</InputLabel>
                  <Select
                    className={classes.select}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={city}
                    label="בחר עיר"
                    onChange={(event) => setCity(event.target.value)}
                  >
                    <MenuItem className={classes.menuItem} value="אשדוד">
                      אשדוד
                    </MenuItem>
                    <MenuItem className={classes.menuItem} value="אלעד">
                      אלעד
                    </MenuItem>
                    <MenuItem className={classes.menuItem} value="בני ברק">
                      בני ברק
                    </MenuItem>
                    <MenuItem className={classes.menuItem} value="שאר ערים">
                      שאר ערים
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="class">כיתה</InputLabel>
                  <Select
                    className={classes.select}
                    labelId="class"
                    id="demo-simple-select"
                    value={clas}
                    label="כיתה"
                    onChange={(event) => setClas(event.target.value)}
                  >
                    <MenuItem value="גן">גן</MenuItem>
                    <MenuItem value="מכינה">מכינה</MenuItem>
                    <MenuItem value="א">א'</MenuItem>
                    <MenuItem value="ב">ב'</MenuItem>
                    <MenuItem value="ג">ג'</MenuItem>
                    <MenuItem value="ד">ד'</MenuItem>
                    <MenuItem value="ה">ה'</MenuItem>
                    <MenuItem value="ו">ו'</MenuItem>
                    <MenuItem value="ז">ז'</MenuItem>
                    <MenuItem value="ח">ח'</MenuItem>
                    <MenuItem value="ט">ט'</MenuItem>
                  </Select>
                </FormControl>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="urgency_level-select-label">
                    רמת דחיפות
                  </InputLabel>
                  <Select
                    className={classes.select}
                    labelId="urgency_level-select-label"
                    id="demo-simple-select"
                    value={urgency}
                    label="רמת דחיפות"
                    onChange={(event) => setUrgency(event.target.value)}
                  >
                    <MenuItem value="גבוה">גבוה</MenuItem>
                    <MenuItem value="בינוני">בינוני</MenuItem>
                    <MenuItem value="נמוך">נמוך</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <div className={classes.btns}>
                <button className={classes.saveBtn}>שמירה</button>
                <button
                  onClick={() => setShowForm(false)}
                  className={classes.cancelBtn}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {openAlert && <SnackbarMUI state={state} message={messags} />}
    </div>
  );
}

export default AddStudentBtn;
