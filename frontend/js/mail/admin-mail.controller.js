'use strict';

angular.module('linagora.esn.admin')

.constant('ADMIN_MAIL_TRANSPORT_TYPES', ['Local', 'SMTP', 'Gmail'])

.controller('adminMailController', function($stateParams, adminDomainConfigService, asyncAction, ADMIN_MAIL_TRANSPORT_TYPES, rejectWithErrorNotification) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'mail';

  self.transportTypes = ADMIN_MAIL_TRANSPORT_TYPES;

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data;
      self.config.transport = data.transport || {};
      self.config.transport.config = self.config.transport.config || {};
      self.transportType = _getTransportType(data);
    });

  self.save = function(form) {
    if (form && form.$valid) {
      var config = _qualifyTransportConfig();

      return asyncAction('Modification of Mail Server settings', function() {
        return _saveConfiguration(config);
      })
      .then(function() {
        self.config = config;
      });
    }
  };

  function _saveConfiguration(config) {
    return adminDomainConfigService.set(domainId, {
      name: CONFIG_NAME,
      value: config
    });
  }

  function _getTransportType(config) {
    if (config.transport.module) {
      return self.transportTypes[0];
    } else if (config.transport.config.service) {
      if (config.transport.config.service === 'gmail') {
        return self.transportTypes[2];
      } else {
        return self.transportTypes[0];
      }
    } else {
      return self.transportTypes[1];
    }
  }

  function _qualifyTransportConfig() {

    var currentConfig = self.config;
    var config = {
      mail: {
        noreply: currentConfig.mail.noreply
      }
    };

    switch (self.transportType) {

      case 'Local':
        config.transport = {
          module: currentConfig.transport.module,
          config: {
            dir: currentConfig.transport.config.dir,
            browser: currentConfig.transport.config.browser
          }
        };
        break;

      case 'SMTP':
        config.transport = {
          config: {
            host: currentConfig.transport.config.host,
            secure: currentConfig.transport.config.secure,
            tls: {
              rejectUnauthorized: currentConfig.transport.config.tls.rejectUnauthorized
            },
            port: currentConfig.transport.config.port,
            auth: {
              user: currentConfig.transport.config.auth.user,
              pass: currentConfig.transport.config.auth.pass
            }
          }
        };
        break;

      case 'Gmail':
        config.transport = {
          config: {
            service: 'gmail',
            auth: {
              user: currentConfig.transport.config.auth.user,
              pass: currentConfig.transport.config.auth.pass
            }
          }
        };
        break;
      default:
        throw new Error('Unknown transport type: ' + self.transportType);
    }

    return config;
  }
});
