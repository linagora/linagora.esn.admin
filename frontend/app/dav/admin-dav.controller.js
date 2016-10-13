'use strict';

angular.module('linagora.esn.admin')

.controller('adminDavController', function($stateParams, adminDomainConfigService, asyncAction, rejectWithErrorNotification) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'davserver';

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data;
    });

  self.save = function(form) {
    if (form && form.$valid) {
      return asyncAction('Modification of DAV Server settings', _saveConfiguration);
    }

    return rejectWithErrorNotification('Form is invalid!');
  };

  function _saveConfiguration() {
    return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
  }
});
