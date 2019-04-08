const { AUTOCONF_TEMPLATE, AUTOCONF_ACCOUNT_TEMPLATE } = require('./constants');

module.exports = (dependencies) => {
  const { validator } = dependencies('esn-config');
  const logger = dependencies('logger');

  return {
    validateConfiguration
  };

  function validateConfiguration(req, res, next) {
    const account = { ...AUTOCONF_ACCOUNT_TEMPLATE, ...req.body };
    const config = { ...AUTOCONF_TEMPLATE, accounts: [account] };

    validator
      .validate('core', 'autoconf', config)
      .then((result) => {
        if (result.ok) {
          req.body = config;

          return next();
        }

        res.status(400).json({
          error: {
            code: 400,
            message: 'Bad Request',
            details: `Bad autoconf format: ${result.message}`
          }
        });
      })
      .catch((error) => {
        logger.error('Error while validating autoconf data', error);

        res.status(500).json({
          error: {
            code: 500,
            message: 'Server Error',
            details: 'Error while validating autoconf data'
          }
        });
      });
  }
};
