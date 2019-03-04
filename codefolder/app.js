const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

process.env.FILES_ROOT_FOLDER = '.';


app.use(bodyParser.urlencoded({ extended: false }));
// Required to all static files.
app.use(express.static('templates'));

app.get('/', (req, res) => {
  console.log('In the middleware!');
  const pathIndex = path.join(__dirname, 'templates', 'index.html');
  res.sendFile(pathIndex);
  // next(); // Allows the request to continue to the next middleware in line
});

app.post('/', () => {
  console.log('In the middleware Post!');
});
// 404 section
app.use((req, res) => {
  console.log('In the 404 middleware!');
  const path404 = path.join(__dirname, 'templates', 'error404.html');
  console.log(path404);
  res.status(404).sendFile(path404);
});

const server = http.createServer(app);

server.listen(8080);
