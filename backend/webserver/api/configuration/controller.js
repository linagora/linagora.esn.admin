'use strict';

let esnConfig;
let logger;
let authJwt;

function getConfigurations(req, res) {
  const modules = req.body;
  const user = req.user;

  return esnConfig.configurations.getConfigurations(modules, user.preferredDomainId)
    .then(
      modules => res.status(200).json(modules),
      (err) => {
        logger.error('Error while getting configurations:', err);

        return res.status(500).json({error: {code: 500, message: 'Server Error', details: err.message}});
      }
    );
}

function updateConfigurations(req, res) {
  const modules = req.body;
  const user = req.user;

  return esnConfig.configurations.updateConfigurations(modules, user.preferredDomainId)
    .then(
      () => res.status(204).end(),
      (err) => {
        logger.error('Error while updating configuration:', err);

        return res.status(500).json({error: {code: 500, message: 'Server Error', details: err.message}});
      }
    );
}

function generateJwtKeyPair(req, res) {
  authJwt.generateKeyPair(function(err, keys) {
    if (err) {
      logger.error('Error while generating RSA keypair for JWT:', err);

      return res.status(500).json({
        error: {
          code: 500,
          message: 'Server Error',
          details: 'Cannot generate RSA keypair'
        }
      });
    }

    res.status(200).json(keys);
  });
}

module.exports = function(dependencies) {
  esnConfig = dependencies('esn-config');
  logger = dependencies('logger');
  authJwt = dependencies('auth').jwt;

  return {
    getConfigurations,
    updateConfigurations,
    generateJwtKeyPair
  };
};
