'use strict';

const express = require('express');

module.exports = function(dependencies) {
  const authorizationMW = dependencies('authorizationMW');
  const domainMiddleware = dependencies('domainMiddleware');
  const controller = require('./controller')(dependencies);

  const router = express.Router();

  router.post('/domains/:uuid/sendEmail',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.testSendEmail);

  return router;
};
