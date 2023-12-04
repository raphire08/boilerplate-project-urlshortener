require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validUrl = require('valid-url');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/public/index.html');
});

let map = new Map();


app.post('/api/shorturl', function (req, res) {
  const url = req.body['url']
  const isValid = validUrl.isWebUri(url);
  if (isValid) {
    const number = Math.floor((Math.random() * 10000) + 1);
    map.set(number.toString(), url);
    return res.json({ original_url: url, short_url: number });
  } else {
    return res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:shorturl', function (req, res) {
  const number = req.params.shorturl;
  const url = map.get(number);
  if (url !== undefined) {
    res.redirect(url);
  } else {
    return;
  }
});


app.listen(port, function () {
  console.log(`app listening on port ${port}`)
});