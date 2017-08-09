'use strict';

const express = require('express');

module.exports = function(dependencies) {
  const authorizationMW = dependencies('authorizationMW');
  const platformadminsMW = dependencies('platformadminsMW');
  const controller = require('./controller')(dependencies);

  const router = express.Router();

  /**
   * @swagger
   * /configuration/generateJwtKeyPair:
   *   post:
   *     tags:
   *       - Configuration
   *     description: Creates a pair of JWT keys
   *     responses:
   *       200:
   *         $ref: "#/responses/admin_configuration_jwt_keys"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.post('/generateJwtKeyPair',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    controller.generateJwtKeyPair);

  return router;
};
