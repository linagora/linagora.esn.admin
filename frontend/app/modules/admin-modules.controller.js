'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesController', function($stateParams, rejectWithErrorNotification, adminModulesApi, adminDomainConfigService) {
  var self = this;
  var domainId = $stateParams.domainId;
  var HOMEPAGE_VALUE = 'unifiedinbox';
  var HOMEPAGE_KEY = 'homePage';

  adminDomainConfigService.get(domainId, HOMEPAGE_KEY).then(function(data) {
    self.homePage = data || HOMEPAGE_VALUE;
  });

  adminModulesApi.get(domainId).then(function(modules) {
    self.modules = modules;
  });
});
