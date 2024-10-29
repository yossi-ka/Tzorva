import { db } from "./config.js";
import { getDocs, collection, query, where } from "firebase/firestore";

const getAllUsers = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const findUserByUID = async (uid) => {
  const q = query(collection(db, "users"), where("UID", "==", uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No such document!");
    return null;
  } else {
    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = { id: doc.id, ...doc.data() };
    });
    return userData;
  }
};

const getAllStudents = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "students"));
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const getStudents = async (uid) => {
  const allStudents = await getAllStudents();
  try {
    const user = await findUserByUID(uid);
    if (user.job_title === "מנהל ארגון") {
      return allStudents;
    } else {
      const students = [];
      const studArr = user["access_permissions"]?.students || [];
      studArr.forEach((id) => {
        const student = allStudents.find(
          (student) => student.student_id === id
        );
        if (student) {
          students.push(student);
        }
      });
      return students;
    }
  } catch (e) {
    return [];
  }
};

const getFinance = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "finance"));
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const getArchive = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "archive"));
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const getAllInterventions = async () => {
  const arr = [];
  const querySnapshot = await getDocs(collection(db, "interventions"));
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const getInterventionsByStudent = async (studentId) => {
  const arr = [];
  const q = query(
    collection(db, "interventions"),
    where("student_id", "==", studentId)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const getInterventionsByTutor = async (tutorId) => {
  const arr = [];
  const q = query(
    collection(db, "interventions"),
    where("tutor_id", "==", tutorId)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    arr.push(doc.data());
  });
  return arr;
};

const getInterventionsByCity = async (city) => {
  const studetsArr = await getAllStudents();
  const filteredStudets = studetsArr.filter(
    (student) => student.city_of_school === city
  );
  const interventionsArr = await getAllInterventions();

  const arr = filteredStudets.flatMap((docu) =>
    interventionsArr.filter((doc) => doc.student_id === docu.student_id)
  );

  return arr;
};

const getIntervention = async (user, student_id) => {
  if (!student_id) {
    if (user.job_title === "מנהל ארגון" || user.job_title === "יועץ") {
      return await getAllInterventions();
    } else if (user.job_title === `מנהל ת"ת`) {
      return await getInterventionsByCity(user.city);
    } else if (user.job_title === "מטפל") {
      return await getInterventionsByTutor(user.user_id);
    }
  } else if (student_id) {
    return await getInterventionsByStudent(student_id);
  }
  return [];
};

export {
  getAllUsers,
  findUserByUID,
  getStudents,
  getAllStudents,
  getFinance,
  getArchive,
  getIntervention,
};
