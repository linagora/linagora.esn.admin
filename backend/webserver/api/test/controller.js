'use strict';

const ldapModule = require('../../../lib/ldap');

var emailModule;

function testSendEmail(req, res) {
  var mailConfig = req.body.config;
  var to = req.body.to;

  if (!to || !mailConfig) {
    return res.status(400).json({error: {code: 400, message: 'Bad Request', details: 'The to or config field is missing'}});
  }

  var message = {
    to: to,
    subject: 'Test email from OpenPaas',
    html: 'Hello, this is test email sent by OpenPaas'
  };

  emailModule.mailSenderBuilder(mailConfig).send(message, function(err) {
    if (err) {
      return res.status(500).json({error: {code: 500, message: 'Server Error', details: err.message}});
    }

    return res.status(200).end();
  });
}

function testAccessLdap(req, res) {
  const ldapConfig = req.body.config;

  if (!ldapConfig) {
    return res.status(400).json({error: {code: 400, message: 'Bad Request', details: 'The ldap\'s configuration is missing'}});
  }

  ldapModule.testAccessLdap(ldapConfig).then(
    () => res.status(200).end(),
    err => res.status(500).json({error: {code: 500, message: 'Server Error', details: err.message}})
  );
}

module.exports = function(dependencies) {
  emailModule = dependencies('email');

  return {
    testSendEmail: testSendEmail,
    testAccessLdap: testAccessLdap
  };
};
