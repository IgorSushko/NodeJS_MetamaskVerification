const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const etheriumtest = require('./src/workWithEthereum.js');

const app = express();

process.env.FILES_ROOT_FOLDER = '.';


app.use(bodyParser.urlencoded({ extended: false }));
// Required to all static files.
app.use(express.static('templates'));



async function verifypk() {
  const pathIndexpk = path.join(__dirname, 'privateKey', 'privateKey.txt');
  const isprivatekeyexist = etheriumtest.fileExists(pathIndexpk);
  if (!isprivatekeyexist) {
    const adress = etheriumtest.generateWalleteAddress('7894523695148432');
    etheriumtest.writeadress(pathIndexpk, adress);
  }
  console.log('Is folder exist: ', isprivatekeyexist);
  }
  
  async function initfile() {
    await verifypk();
  }
// 404 section

app.get('/', (req, res, next) => {
  console.log('In the middleware 17!');
  const pathIndex = path.join(__dirname, 'templates', 'index2.html');
  res.sendFile(pathIndex);
  console.log('where is log');
  initfile();
  // next(); // Allows the request to continue to the next middleware in line
});
app.post('/', (req, res, next) => {
  console.log('In the middleware Post!');
  const bodyReq = JSON.stringify(req.body);
  console.log(bodyReq);
});

app.use((req, res, next) => {
  console.log('In the 404 middleware44!');
  const path404 = path.join(__dirname, 'templates', 'error404.html');
  console.log(path404);
  res.status(404).sendFile(path404);
});
const server = http.createServer(app);

server.listen(8080);
