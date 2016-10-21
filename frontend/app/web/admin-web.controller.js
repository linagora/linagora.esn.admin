'use strict';

angular.module('linagora.esn.admin')

.controller('adminWebController', function($stateParams, adminDomainConfigService, asyncAction, rejectWithErrorNotification) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'web';

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data;
    });

  self.save = function(form) {
    if (form && form.$valid) {
      return asyncAction('Modification of web configuration', _saveConfiguration)
        .then(function() {
          form.$setPristine();
        });
    }

    form.$setSubmitted();

    return rejectWithErrorNotification('Form is invalid!');
  };

  function _saveConfiguration() {
    return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
  }
});
