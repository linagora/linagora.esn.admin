'use strict';

var q = require('q');
var esnConfig;
var logger;
var authJwt;

function _getConfig(moduleName, user, key) {
  return esnConfig(key)
    .inModule(moduleName)
    .forUser(user)
    .get()
    .then(function(data) {
      return {
        name: key,
        value: data
      };
    });
}

function _getConfigs(moduleName, user, keys) {
  return q.all(keys.map(function(key) {
    return _getConfig(moduleName, user, key);
  }))
  .then(function(configs) {
    return {
      name: moduleName,
      configurations: configs
    };
  });
}

function getConfigurations(req, res) {
  var modules = req.body;
  var user = req.user;

  if (!Array.isArray(modules)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Bad Request',
        details: 'body should be an array'
      }
    });
  }

  q.all(modules.map(function(module) {
    return _getConfigs(module.name, user, module.keys);
  }))
  .then(function(modules) {
    return res.status(200).json(modules);
  }, function(err) {
    logger.error('Error while getting configurations:', err);

    return res.status(500).json({error: {code: 500, message: 'Server Error', details: err.message}});
  });
}

function updateConfigurations(req, res) {
  var modules = req.body;
  var domainId = req.domain._id;

  if (!Array.isArray(modules)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Bad Request',
        details: 'body should be an array'
      }
    });
  }

  var promiseFns = modules.map(function(module) {
    return function() {
      var esnConf = new esnConfig.EsnConfig(module.name, domainId);

      return esnConf.setMultiple(module.configurations);
    };
  });

  // update sequentially to avoid concurrent update
  return promiseFns.reduce(q.when, q()).then(function() {
    return res.status(204).end();
  }, function(err) {
    logger.error('Error while updating configuration:', err);

    return res.status(500).json({error: {code: 500, message: 'Server Error', details: err.message}});
  });
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
