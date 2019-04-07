const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const etheriumtest = require('./src/workWithEthereum.js');

const app = express();

process.env.FILES_ROOT_FOLDER = '.';


app.use(bodyParser.json()); // bodyParser.urlencoded({ extended: false })
// Required to all static files.
app.set('view engine', 'ejs');
app.set('views', 'templates'); // set folder that include *.ejs files
app.use(express.static('templates'));


async function verifypk() {
  const pathIndexpk = path.join(__dirname, 'privateKey', 'privateKey.txt');
  const isprivatekeyexist = etheriumtest.fileExists(pathIndexpk);
  if (!isprivatekeyexist) {
    const adress = etheriumtest.generateWalleteAddress('7894523695148432');  //7894523695148432 partial privatekey
    etheriumtest.writeadress(pathIndexpk, adress);
  }
  console.log('Is folder exist: ', isprivatekeyexist);
}

async function initfile() {
  await verifypk();
}
// 404 section
// GET http://localhost:62001/restapi/getadress
app.get('/restapi/getadress', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  initfile();
  const fromfileaddr = etheriumtest.readpublicadress();
  res.status(200).json({ adress: fromfileaddr });
});

app.get('/', (req, res, next) => {
  const pathIndex = path.join(__dirname, 'templates', 'index2.html');
  res.sendFile(pathIndex);
  console.log('Inside "/" get request ');
  //initfile();
  //const fromfileaddr = etheriumtest.readpublicadress();
  //res.render('index2', { ethadress: fromfileaddr });
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
