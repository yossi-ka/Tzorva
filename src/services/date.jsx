import Hebcal from "hebcal";

export const formatDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

export const formatDateToHebrew = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const hebrewDate = new Hebcal.HDate(date);
  return hebrewDate.toString("h"); // "h" מציין את הפורמט העברי
};
