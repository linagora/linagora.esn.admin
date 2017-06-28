'use strict';

const express = require('express');

module.exports = function(dependencies) {
  const authorizationMW = dependencies('authorizationMW');
  const domainMiddleware = dependencies('domainMiddleware');
  const platformadminsMW = dependencies('platformadminsMW');
  const controller = require('./controller')(dependencies);

  const router = express.Router();

  router.post('/domains/:uuid/generateJwtToken',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.generateJwtToken);

  router.post('/generateJwtKeyPair',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    controller.generateJwtKeyPair);

  return router;
};
