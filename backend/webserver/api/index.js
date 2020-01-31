const express = require('express');

module.exports = dependencies => {
  const router = express.Router();

  router.use('/autoconf', require('./autoconf')(dependencies));
  router.use('/configuration', require('./configuration')(dependencies));
  router.use('/maintenance', require('./maintenance')(dependencies));
  router.use('/test', require('./test')(dependencies));

  return router;
};
