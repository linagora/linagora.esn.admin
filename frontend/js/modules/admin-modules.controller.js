'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesController', function($stateParams, rejectWithErrorNotification, adminModulesApi, adminDomainConfigService, asyncAction) {
  var self = this;
  var domainId = $stateParams.domainId;
  var oldModules;
  var HOMEPAGE_VALUE = 'unifiedinbox';
  var HOMEPAGE_KEY = 'homePage';

  adminDomainConfigService.get(domainId, HOMEPAGE_KEY).then(function(data) {
    self.homePage = data || HOMEPAGE_VALUE;
  });

  adminModulesApi.get(domainId).then(function(modules) {
    self.modules = modules;
    oldModules = angular.copy(modules);
  });

  self.save = function(form) {
    if (form && form.$valid) {
      if (angular.equals(oldModules, self.modules)) {
        return rejectWithErrorNotification('Nothing change to update!');
      }

      return asyncAction('Modification of modules\'s settings', function() {
        return adminModulesApi.set(domainId, self.modules);
      }).then(function() {
        oldModules = angular.copy(self.modules);
      });
    }

    return rejectWithErrorNotification('Form is invalid!');
  };

});
