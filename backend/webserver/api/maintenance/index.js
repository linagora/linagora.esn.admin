'use strict';

const express = require('express');

module.exports = function(dependencies) {
  const authorizationMW = dependencies('authorizationMW');
  const platformadminsMW = dependencies('platformadminsMW');
  const helperMW = dependencies('helperMW');
  const controller = require('./controller')(dependencies);
  const { validateMaintenanceAction, validateMaintenanceResourceType } = require('./middleware')(dependencies);

  const router = express.Router();

  /**
   * @swagger
   * /elasticsearch:
   *   get:
   *     tags:
   *       - Maintenance
   *       - Elasticsearch
   *     description: Get supported resource types in Elasticsearch
   *     responses:
   *      200:
   *        $ref: "#/responses/cm_202"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.get('/elasticsearch',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    controller.getRegisteredTypes
  );

  /**
   * @swagger
   * /elasticsearch:
   *   post:
   *     tags:
   *       - Maintenance
   *       - Elasticsearch
   *     description: Maintain Elasticsearch <br>
   *       - Initialize Elasticsearch indices <br>
   *       - Update settings and mappings for indices <br>
   *       - Reindex data from Database to indices
   *     parameters:
   *       - $ref: "#/parameters/maintenance_elasticsearch_action"
   *       - $ref: "#/parameters/maintenance_elasticsearch_resource_type"
   *     responses:
   *      202:
   *        $ref: "#/responses/cm_202"
   *      400:
   *        $ref: "#/responses/cm_400"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.post('/elasticsearch',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    helperMW.requireInQuery(['action', 'resource_type']),
    validateMaintenanceAction,
    validateMaintenanceResourceType,
    controller.maintainElasticsearch);

  return router;
};
