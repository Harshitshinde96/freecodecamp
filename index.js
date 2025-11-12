require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const { URL } = require("url");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(${process.cwd()}/public));

// Home route
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Simple test route
app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

// In-memory storage
const urls = new Map();
let counter = 1;

// Helper function to validate URL format and hostname
function isValidHttpUrl(input) {
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return false;
  }

  // Must start with http:// or https://
  if (!/^https?:\/\//i.test(input)) return false;

  // Must have a valid hostname
  if (!parsed.hostname) return false;

  return parsed;
}

// POST endpoint for URL shortening
app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;

  const parsed = isValidHttpUrl(url);
  if (!parsed) {
    return res.json({ error: "invalid url" });
  }

  // Check domain existence
  dns.lookup(parsed.hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    } else {
      // Check if already stored
      for (const [id, original] of urls.entries()) {
        if (original === url) {
          return res.json({ original_url: url, short_url: id });
        }
      }

      const short_url = counter++;
      urls.set(short_url, url);
      return res.json({ original_url: url, short_url });
    }
  });
});

// GET redirect route
app.get("/api/shorturl/:id", (req, res) => {
  const id = Number(req.params.id);
  const original = urls.get(id);
  if (!original) return res.json({ error: "No short URL found" });
  res.redirect(original);
});

// Start server
app.listen(port, () => {
  console.log(Listening on port ${port});
});
