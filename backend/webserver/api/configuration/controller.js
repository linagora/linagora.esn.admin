'use strict';

let logger;
let authJwt;

module.exports = function(dependencies) {
  logger = dependencies('logger');
  authJwt = dependencies('auth').jwt;

  return {
    generateJwtKeyPair
  };
};

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
