'use strict';

var q = require('q');
var esnConfig;
var logger;

function getConfigurations(req, res) {
  var configNames = req.body.configNames;
  var user = req.user;

  if (!Array.isArray(configNames)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Bad Request',
        details: 'configNames should be an array of configuration\'s name'
      }
    });
  }

  q.all(configNames.map(function(configName) {
    return esnConfig(configName)
      .forUser(user)
      .get()
      .then(function(data) {
        if (!data) {
          return null;
        }

        return {
          name: configName,
          value: data
        };
      });
  })).then(function(configs) {
    return res.status(200).json(configs.filter(Boolean));
  }, function(err) {
    logger.error('Error while getting configuration:', err);

    return res.status(500).json({error: {code: 500, message: 'Server Error', details: err.message}});
  });
}

function updateConfigurations(req, res) {
  var configs = req.body.configs;
  var domainId = req.domain._id;

  if (!Array.isArray(configs)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Bad Request',
        details: 'configs should be an array of configuration to update'
      }
    });
  }

  var esnConf = new esnConfig.EsnConfig(null, domainId);

  esnConf.setMultiple(configs)
    .then(function() {
      return res.status(200).json(configs);
    }, function(err) {
      logger.error('Error while updating configuration:', err);

      return res.status(500).json({error: {code: 500, message: 'Server Error', details: err.message}});
    });
}

module.exports = function(dependencies) {
  esnConfig = dependencies('esn-config');
  logger = dependencies('logger');

  return {
    getConfigurations: getConfigurations,
    updateConfigurations: updateConfigurations
  };
};
