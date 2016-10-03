'use strict';

angular.module('linagora.esn.admin')

.controller('adminDavController', function($stateParams, adminDomainConfigService, asyncAction, rejectWithErrorNotification) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'davserver';
  var oldConfig;

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data;
      oldConfig = angular.copy(self.config);
    });

  self.save = function(form) {
    if (angular.equals(oldConfig, self.config)) {
      return rejectWithErrorNotification('Nothing change to update!');
    }

    if (form && form.$valid) {
      return asyncAction('Modification of DAV Server settings', _saveConfiguration)
        .then(function() {
          oldConfig = angular.copy(self.config);
        });
    }

    return rejectWithErrorNotification('Form is invalid!');
  };

  function _saveConfiguration() {
    return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
  }
});
