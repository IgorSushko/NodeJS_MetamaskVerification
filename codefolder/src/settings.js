module.exports = {
  PORT : 8080,
  DB_HOST: 'dbtestn',
  DB_NAME : 'testmysql',
  DB_USER : 'igor',
  DB_PASS : 'nicecti1!',
  TEMPLATE_PATH: `${process.env.FILES_ROOT_FOLDER}/templates/index.html`,
  TEMPLATE_FILES: {
    '/style.css': {
      type: 'text/css',
      path: `${process.env.FILES_ROOT_FOLDER}/templates/style.css`,
    },
    '/favicon.png': {
      type: 'image/png',
      path: `${process.env.FILES_ROOT_FOLDER}/templates/favicon.png`,
    },
    '/favicon.ico': {
      type: 'image/png',
      path: `${process.env.FILES_ROOT_FOLDER}/templates/favicon.png`,
    },
  },
};
