const path = require('path');
const io = require('../src/socketio');


exports.provideGetPageIndex = (req, res, next) => {
  const pathIndex = path.join(path.dirname(process.mainModule.filename), 'templates', 'index2.html');
  res.sendFile(pathIndex);
  console.log('Inside "/" get request ');

};

exports.providePostPageIndex = (req, res, next) => {
  console.log('In the middleware Post!');
  const bodyReq = JSON.stringify(req.body);
  console.log(bodyReq);
};
