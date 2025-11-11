// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// body parsing middleware for form submissions and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory storage for Exercise Tracker
const users = []; // each user: { username, _id, log: [ { description, duration, date: Date } ] }
let nextUserId = 1;

// File upload handling for File Metadata Microservice
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Exercise Tracker - create new user
app.post('/api/users', function (req, res) {
  const username = req.body.username;
  if (!username) return res.status(400).json({ error: 'username required' });
  const user = { username, _id: String(nextUserId++), log: [] };
  users.push(user);
  res.json({ username: user.username, _id: user._id });
});

// Exercise Tracker - get all users
app.get('/api/users', function (req, res) {
  const list = users.map(u => ({ username: u.username, _id: u._id }));
  res.json(list);
});

// Exercise Tracker - add exercise
app.post('/api/users/:_id/exercises', function (req, res) {
  const id = req.params._id;
  const user = users.find(u => u._id === id);
  if (!user) return res.status(400).json({ error: 'unknown user id' });

  const description = req.body.description;
  const duration = Number(req.body.duration);
  let date = req.body.date ? new Date(req.body.date) : new Date();

  if (!description || !duration || isNaN(duration)) {
    return res.status(400).json({ error: 'description and duration are required' });
  }

  if (date.toString() === 'Invalid Date') {
    return res.status(400).json({ error: 'Invalid Date' });
  }

  const entry = { description, duration, date };
  user.log.push(entry);

  res.json({
    username: user.username,
    description: entry.description,
    duration: entry.duration,
    date: entry.date.toDateString(),
    _id: user._id
  });
});

// Exercise Tracker - get logs
app.get('/api/users/:_id/logs', function (req, res) {
  const id = req.params._id;
  const user = users.find(u => u._id === id);
  if (!user) return res.status(400).json({ error: 'unknown user id' });

  let { from, to, limit } = req.query;
  let log = user.log.slice();

  if (from) {
    const fromDate = new Date(from);
    if (fromDate.toString() !== 'Invalid Date') {
      log = log.filter(e => e.date >= fromDate);
    }
  }
  if (to) {
    const toDate = new Date(to);
    if (toDate.toString() !== 'Invalid Date') {
      log = log.filter(e => e.date <= toDate);
    }
  }
  if (limit) {
    const n = Number(limit);
    if (!isNaN(n)) log = log.slice(0, n);
  }

  const formattedLog = log.map(e => ({ description: e.description, duration: e.duration, date: e.date.toDateString() }));

  res.json({ username: user.username, count: formattedLog.length, _id: user._id, log: formattedLog });
});


// File Metadata Microservice - file upload
// The file input field name should be 'upfile'
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { originalname, mimetype, size } = req.file;
  res.json({ name: originalname, type: mimetype, size });
});


// Timestamp microservice endpoint
app.get('/api/:date?', function (req, res) {
  const dateParam = req.params.date;

  // If no date parameter, return current time
  if (!dateParam) {
    const now = new Date();
    return res.json({ unix: now.getTime(), utc: now.toUTCString() });
  }

  // If the param is purely numeric (including negative), treat it as milliseconds
  const numericRegex = /^-?\d+$/;
  let date;
  if (numericRegex.test(dateParam)) {
    date = new Date(Number(dateParam));
  } else {
    date = new Date(dateParam);
  }

  // Check for invalid date
  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  // Valid date
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});



// Listen on port set in environment variable or default to 3000
const port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Handle server errors (for example, port already in use)
listener.on('error', function(err) {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${port} is already in use (EADDRINUSE).`);
    console.error('Tip: stop the process using the port or set a different PORT environment variable.');
    // exit with non-zero so process managers (nodemon) know it failed
    process.exit(1);
  }
  // rethrow other errors
  throw err;
});
