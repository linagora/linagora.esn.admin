'use strict';

var express = require('express');

module.exports = function(dependencies) {
  var authorizationMW = dependencies('authorizationMW');
  var domainMiddleware = dependencies('domainMiddleware');
  var controller = require('./controller')(dependencies);

  var router = express.Router();

  router.post('/domain/:uuid/sendEmail',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.testSendEmail);

  return router;
};
