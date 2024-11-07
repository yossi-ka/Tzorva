import Hebcal from "hebcal";

export const formatDate = (timestamp) => {

  if (!timestamp) {
    return "";
  }

  if (typeof timestamp === "string") {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const date = new Date((timestamp._seconds || timestamp.seconds) * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
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
