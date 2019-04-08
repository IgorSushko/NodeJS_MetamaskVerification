const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/withapi');
const indexRoutes = require('./routes/index2');

const app = express();

app.use(bodyParser.json()); // bodyParser.urlencoded({ extended: false })
// Required to all static files.
app.set('view engine', 'ejs');
app.set('views', 'templates'); // set folder that include *.ejs files
app.use(express.static('templates'));

app.use('/', indexRoutes);

app.use('/restapi', feedRoutes);

app.use((req, res, next) => {
  console.log('In the 404 middleware44!');
  const path404 = path.join(__dirname, 'templates', 'error404.html');
  console.log(path404);
  res.status(404).sendFile(path404);
});


const server = http.createServer(app);

server.listen(8080);
