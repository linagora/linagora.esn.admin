'use strict';

angular.module('linagora.esn.admin')

.constant('ADMIN_MAIL_TRANSPORT_TYPES', ['Local', 'SMTP', 'Gmail'])

.controller('adminMailController', function($stateParams, adminDomainConfigService, adminMailService, asyncAction, ADMIN_MAIL_TRANSPORT_TYPES, rejectWithErrorNotification, $timeout) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'mail';
  var oldConfig;

  self.transportTypes = ADMIN_MAIL_TRANSPORT_TYPES;

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.transportType = data.transport ? adminMailService.getTransportType(data) : null;
      self.config = data;
      oldConfig = angular.copy(self.config);
    });

  self.save = function(form) {
    if (form && form.$valid) {
      var config = adminMailService.qualifyTransportConfig(self.transportType, self.config);

      if (angular.equals(oldConfig, config)) {
        return rejectWithErrorNotification('Nothing change to update!');
      }

      return asyncAction('Modification of Mail Server settings', function() {
        return _saveConfiguration(config);
      }).then(function() {
        self.config = config;
        oldConfig = angular.copy(self.config);
      });
    }

    return rejectWithErrorNotification('Form is invalid!');
  };

  function _saveConfiguration(config) {
    return adminDomainConfigService.set(domainId, {
      name: CONFIG_NAME,
      value: config
    });
  }
});
