/**
  * @swagger
  * parameter:
  *   admin_test_domain_uuid:
  *     name: uuid
  *     in: path
  *     description: The domain ID
  *     required: true
  *     type: string
  *     format: uuid
  *   admin_test_mail_config:
  *     name: config
  *     in: body
  *     description: Mail config for email sending testing
  *     required: true
  *     schema:
  *       type: object
  *       properties:
  *         mail:
  *           type: object
  *         transport:
  *           type: object
  *   admin_test_mail_to:
  *     name: to
  *     in: body
  *     description: Receiver email address
  *     required: true
  *     schema:
  *       type: string
  *   admin_test_ldap_config:
  *     name: config
  *     in: body
  *     description: LDAP configuration
  *     required: true
  *     schema:
  *       type: object
  */
