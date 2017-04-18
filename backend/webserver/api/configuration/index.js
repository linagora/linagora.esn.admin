'use strict';

const express = require('express');

module.exports = function(dependencies) {
  const authorizationMW = dependencies('authorizationMW');
  const domainMiddleware = dependencies('domainMiddleware');
  const configurationMW = dependencies('configurationMW');
  const helperMW = dependencies('helperMW');
  const platformadminsMW = dependencies('platformadminsMW');
  const controller = require('./controller')(dependencies);

  const router = express.Router();

  router.post('/domains/:uuid',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    helperMW.requireBodyAsArray,
    configurationMW.canReadAdminConfig,
    controller.getConfigurations);

  router.put('/domains/:uuid',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    helperMW.requireBodyAsArray,
    configurationMW.canWriteAdminConfig,
    controller.updateConfigurations);

  router.post('/domains/:uuid/generateJwtToken',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.generateJwtToken);

  router.post('/generateJwtKeyPair',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    controller.generateJwtKeyPair);

  router.post('/',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    helperMW.requireBodyAsArray,
    configurationMW.canReadPlatformConfig,
    controller.getConfigurations);

  router.put('/',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    helperMW.requireBodyAsArray,
    configurationMW.canWritePlatformConfig,
    controller.updateConfigurations);

  return router;
};
