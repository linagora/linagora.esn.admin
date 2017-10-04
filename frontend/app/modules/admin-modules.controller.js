'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesController', function($stateParams, rejectWithErrorNotification, adminModulesService, adminDomainConfigService, ADMIN_LOADING_STATUS) {
  var self = this;
  var domainId = $stateParams.domainId;
  var HOMEPAGE_VALUE = 'unifiedinbox';
  var HOMEPAGE_KEY = 'homePage';

  self.status = ADMIN_LOADING_STATUS.loading;

  adminDomainConfigService.get(domainId, HOMEPAGE_KEY).then(function(data) {
    self.homePage = data || HOMEPAGE_VALUE;
  });

  adminModulesService.get(domainId).then(function(modules) {
    self.modules = modules;
    self.status = ADMIN_LOADING_STATUS.loaded;
  })
  .catch(function() {
    self.status = ADMIN_LOADING_STATUS.error;
  });
});
