const express = require('express');

module.exports = dependencies => {
  const authorizationMW = dependencies('authorizationMW');
  const domainMiddleware = dependencies('domainMiddleware');
  const helperMW = dependencies('helperMW');
  const controller = require('./controller')(dependencies);
  const autoconfMiddleware = require('./middleware')(dependencies);

  const router = express.Router();

  /**
   * @swagger
   * /autoconf:
   *   put:
   *     description: Update autoconf configuration of a domain
   *     parameters:
   *      - $ref: "#/parameters/dm_id_in_query"
   *     responses:
   *      204:
   *        $ref: "#/responses/cm_204"
   *      401:
   *        $ref: "#/responses/cm_401"
   *      400:
   *        $ref: "#/responses/cm_401"
   *      403:
   *        $ref: "#/responses/cm_403"
   *      404:
   *        $ref: "#/responses/cm_404"
   *      500:
   *        $ref: "#/responses/cm_500"
   */
  router.put('/',
    authorizationMW.requiresAPILogin,
    helperMW.requireInQuery('domain_id'),
    domainMiddleware.loadFromDomainIdParameter,
    authorizationMW.requiresDomainManager,
    autoconfMiddleware.validateConfiguration,
    controller.updateAutoconf);

  return router;
};
