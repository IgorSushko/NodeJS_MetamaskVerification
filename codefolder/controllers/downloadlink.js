const path = require('path');


exports.providedownloadlink = (req, res, next) => {
  const pathIndex = path.join(path.dirname(process.mainModule.filename), 'downloadfolder', 'masterimargarita.pdf');
  res.download(pathIndex); // Set disposition and send it.
  console.log('Inside "download" section  ');
};
