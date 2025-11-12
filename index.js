// index.js
// Timestamp Microservice for FreeCodeCamp project

const express = require("express");
const cors = require("cors");

const app = express();

// enable CORS so the API is remotely testable by FCC
app.use(cors({ optionsSuccessStatus: 200 }));

// serve static files and index page
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// API: /api/:date?
app.get("/api/:date?", (req, res) => {
  const { date } = req.params;

  // If no date provided -> current time
  if (!date) {
    const now = new Date();
    return res.json({ unix: now.getTime(), utc: now.toUTCString() });
  }

  // If date is only digits, treat as milliseconds since epoch
  // (some tests send e.g. 1451001600000)
  const digitsOnly = /^\d+$/;
  let dateObj;
  if (digitsOnly.test(date)) {
    // parse as integer (milliseconds)
    dateObj = new Date(Number(date));
  } else {
    // parse using Date constructor (ISO or other formats)
    dateObj = new Date(date);
  }

  // Invalid date handling
  if (isNaN(dateObj.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  // Success
  return res.json({ unix: dateObj.getTime(), utc: dateObj.toUTCString() });
});

// start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
