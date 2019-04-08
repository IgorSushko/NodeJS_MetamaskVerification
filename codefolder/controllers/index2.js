const path = require('path');


exports.provideGetPageIndex = (req, res, next) => {
  const pathIndex = path.join(path.dirname(process.mainModule.filename), 'templates', 'index2.html');
  console.log('pathIndex: ', pathIndex);
  res.sendFile(pathIndex);
  console.log('Inside "/" get request ');
};

exports.providePostPageIndex = (req, res, next) => {
  console.log('In the middleware Post!');
  const bodyReq = JSON.stringify(req.body);
  console.log(bodyReq);
};
