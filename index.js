require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = {};

// Counter to generate short URLs
let counter = 1;

// Route to handle POST requests to /api/shorturl
app.post("/api/shorturl", function (req, res) {
  console.log('body: ', JSON.stringify(req.body));
  const originalUrl = req.body.url;
  console.log({originalUrl});
  // Check if the URL is valid
  const urlPattern = /^(https?):\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
  ;
  if (!urlPattern.test(originalUrl)) {
    return res.status(400).json({ error: 'invalid url' });
  }


  // Generate short URL and save it to the database
  const shortUrl = counter++;
  urlDatabase[shortUrl] = originalUrl;

  // Return JSON response with original URL and short URL
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Route to handle GET requests to /api/shorturl/:short_url
app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = req.params.short_url;

  // Check if the short URL exists in the database
  if (!urlDatabase.hasOwnProperty(shortUrl)) {
    return res.status(404).json({ error: 'short url not found' });
  }

  // Redirect to the original URL
  res.redirect(urlDatabase[shortUrl]);
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
