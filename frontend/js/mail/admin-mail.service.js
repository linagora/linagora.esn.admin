'use strict';

angular.module('linagora.esn.admin')

.factory('adminMailService', function(ADMIN_MAIL_TRANSPORT_TYPES) {

  function getTransportType(mailConfig) {
    if (mailConfig) {
      if (mailConfig.transport.module) {
        return ADMIN_MAIL_TRANSPORT_TYPES[0];
      } else if (mailConfig.transport.config.service) {
        if (mailConfig.transport.config.service === 'gmail') {
          return ADMIN_MAIL_TRANSPORT_TYPES[2];
        } else {
          return ADMIN_MAIL_TRANSPORT_TYPES[0];
        }
      } else {
        return ADMIN_MAIL_TRANSPORT_TYPES[1];
      }
    } else {
      return null;
    }
  }

  function qualifyTransportConfig(transportType, mailConfig) {
    var config = {
      mail: {
        noreply: mailConfig.mail.noreply
      }
    };
    var transportConfig = mailConfig.transport.config;

    switch (transportType) {

      case 'Local':
        config.transport = {
          module: mailConfig.transport.module,
          config: {
            dir: transportConfig.dir,
            browser: transportConfig.browser || false
          }
        };
        break;

      case 'SMTP':
        transportConfig.tls = transportConfig.tls || {};
        config.transport = {
          config: {
            host: transportConfig.host,
            secure: transportConfig.secure || false,
            tls: {
              rejectUnauthorized: transportConfig.tls.rejectUnauthorized || false
            },
            port: transportConfig.port,
            auth: {
              user: transportConfig.auth.user,
              pass: transportConfig.auth.pass
            }
          }
        };
        break;

      case 'Gmail':
        config.transport = {
          config: {
            service: 'gmail',
            auth: {
              user: transportConfig.auth.user,
              pass: transportConfig.auth.pass
            }
          }
        };
        break;

      default:
        config = mailConfig;
    }

    return config;
  }

  return {
    getTransportType: getTransportType,
    qualifyTransportConfig: qualifyTransportConfig
  };
});
