const express = require('express');

module.exports = function(dependencies) {
  const authorizationMW = dependencies('authorizationMW');
  const domainMiddleware = dependencies('domainMiddleware');
  const platformadminsMW = dependencies('platformadminsMW');
  const controller = require('./controller')(dependencies);

  const router = express.Router();

  router.post('/domains/:uuid/sendEmail',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.testSendEmail);

  router.post('/sendEmail',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    controller.testSendEmail);

  router.post('/domains/:uuid/accessLdap',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.testAccessLdap);

  return router;
};
