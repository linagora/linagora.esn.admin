const express = require('express');

module.exports = function(dependencies) {
  const authorizationMW = dependencies('authorizationMW');
  const domainMiddleware = dependencies('domainMiddleware');
  const platformadminsMW = dependencies('platformadminsMW');
  const controller = require('./controller')(dependencies);

  const router = express.Router();

  /**
   * @swagger
   * /domains/{uuid}/sendEmail:
   *   post:
   *     tags:
   *       - Test
   *     description: Send test email using custom mail config (for domain admin)
   *     parameters:
   *       - $ref: "#/parameters/admin_test_domain_uuid"
   *       - $ref: "#/parameters/admin_test_mail_config"
   *       - $ref: "#/parameters/admin_test_mail_to"
   *     responses:
   *       200:
   *         $ref: "#/responses/cm_200"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.post('/domains/:uuid/sendEmail',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.testSendEmail);

  /**
   * @swagger
   * /sendEmail:
   *   post:
   *     tags:
   *       - Test
   *     description: Send test email using custom mail config (for platform admin)
   *     parameters:
   *       - $ref: "#/parameters/admin_test_mail_config"
   *       - $ref: "#/parameters/admin_test_mail_to"
   *     responses:
   *       200:
   *         $ref: "#/responses/cm_200"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.post('/sendEmail',
    authorizationMW.requiresAPILogin,
    platformadminsMW.requirePlatformAdmin,
    controller.testSendEmail);

  /**
   * @swagger
   * /domains/{uuid}/accessLdap:
   *   post:
   *     tags:
   *       - Test
   *     description: Tests LDAP configuration
   *     parameters:
   *       - $ref: "#/parameters/admin_test_domain_uuid"
   *       - $ref: "#/parameters/admin_test_ldap_config"
   *     responses:
   *       200:
   *         $ref: "#/responses/cm_200"
   *       400:
   *         $ref: "#/responses/cm_400"
   *       401:
   *         $ref: "#/responses/cm_401"
   *       403:
   *         $ref: "#/responses/cm_403"
   *       404:
   *         $ref: "#/responses/cm_404"
   *       500:
   *         $ref: "#/responses/cm_500"
   */
  router.post('/domains/:uuid/accessLdap',
    authorizationMW.requiresAPILogin,
    domainMiddleware.load,
    authorizationMW.requiresDomainManager,
    controller.testAccessLdap);

  return router;
};
