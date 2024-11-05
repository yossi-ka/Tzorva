import Hebcal from "hebcal";

export const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

export const formatDateToHebrew = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  try {
    let date;
    if (timestamp && (timestamp.seconds || timestamp._seconds)) {
      const seconds = timestamp.seconds || timestamp._seconds;
      date = new Date(seconds * 1000);
    } else if (typeof timestamp === "string") {
      try {
        const parsed = JSON.parse(timestamp);
        const seconds = parsed.seconds || parsed._seconds;
        date = new Date(seconds * 1000);
      } catch {
        date = new Date(timestamp);
      }
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) {
      return "תאריך לא תקין";
    }

    const hebrewDate = new Hebcal.HDate(date);
    return hebrewDate.toString("h");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "תאריך לא תקין";
  }
};
