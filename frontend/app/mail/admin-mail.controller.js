'use strict';

angular.module('linagora.esn.admin')

.constant('ADMIN_MAIL_TRANSPORT_TYPES', { local: 'Local', smtp: 'SMTP', gmail: 'Gmail' })

.controller('adminMailController', function($stateParams, adminDomainConfigService, adminMailService, asyncAction, ADMIN_MAIL_TRANSPORT_TYPES) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'mail';

  self.transportTypes = ADMIN_MAIL_TRANSPORT_TYPES;

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data || {};
      self.config.resolvers = self.config.resolvers || {};
      self.transportType = adminMailService.getTransportType(self.config);
    });

  self.save = function() {
    var config = adminMailService.qualifyTransportConfig(self.transportType, self.config);

    return asyncAction('Modification of Mail Server settings', function() {
      return _saveConfiguration(config);
    });
  };

  function _saveConfiguration(config) {
    return adminDomainConfigService.set(domainId, CONFIG_NAME, config);
  }
});
