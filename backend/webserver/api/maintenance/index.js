'use strict';

const express = require('express');

module.exports = function(dependencies) {
  const authorizationMW = dependencies('authorizationMW');
  const platformadminsMW = dependencies('platformadminsMW');
  const helperMW = dependencies('helperMW');
  const controller = require('./controller')(dependencies);

  const router = express.Router();

  router.post('/elasticsearch',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    helperMW.requireInQuery(['action', 'resource_type']),
    controller.maintainElasticsearch);

  return router;
};
