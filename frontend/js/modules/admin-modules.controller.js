'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesController', function($stateParams, rejectWithErrorNotification, adminModulesApi, asyncAction) {
  var self = this;
  var domainId = $stateParams.domainId;
  var oldModules;

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
