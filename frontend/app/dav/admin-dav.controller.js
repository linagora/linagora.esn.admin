'use strict';

angular.module('linagora.esn.admin')

.controller('adminDavController', function($stateParams, adminDomainConfigService, asyncAction, ADMIN_DEFAULT_NOTIFICATION_MESSAGES) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'davserver';

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data;
    });

  self.save = function() {
    return asyncAction(ADMIN_DEFAULT_NOTIFICATION_MESSAGES, _saveConfiguration);
  };

  function _saveConfiguration() {
    return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
  }
});
