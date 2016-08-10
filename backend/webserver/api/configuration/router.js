'use strict';

var express = require('express');

module.exports = function(dependencies) {
  var authorizationMW = dependencies('authorizationMW');
  var domainMiddleware = dependencies('domainMiddleware');
  var controller = require('./controller')(dependencies);

  var router = express.Router();

  router.post('/domain/:uuid',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.getConfigurations);

  router.put('/domain/:uuid',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.updateConfigurations);

  return router;
};
