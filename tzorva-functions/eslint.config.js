
export default [
  {
    files: ["**/*.js"], // הקובץ יפנה לכל קבצי JS
    rules: {
      "no-console": "warn", // לדוגמה, אל תרשום שגיאה על שימוש ב-console
      "indent": ["error", 2], // קביעת אינדנטציה של 2 רווחים
      "quotes": ["error", "double"], // להשתמש במרכאות כפולות
      "no-console": "off",
      // הוסף כל כלל אחר שאתה רוצה לקבוע כאן
    },
  },
];

