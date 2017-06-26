'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesDisplayerController', function($stateParams, $scope, $timeout, _, adminDomainConfigService, asyncAction, adminModulesService, ADMIN_MODULES, ADMIN_FORM_EVENT, ADMIN_DEFAULT_NOTIFICATION_MESSAGES) {
  var self = this;
  var domainId = $stateParams.domainId;
  var HOMEPAGE_KEY = 'homePage';
  var timeoutDuration = 500;
  var moduleMetaData;

  self.$onInit = $onInit();

  function $onInit() {
    moduleMetaData = adminModulesService.getModuleMetadata(self.module.name);

    self.title = moduleMetaData.title;
    self.template = moduleMetaData.template;
    self.hasConfiguration = moduleMetaData.configurations && moduleMetaData.configurations.length > 0;
    self.icon = moduleMetaData.icon;
    self.isEnabled = true;
    self.configurations = {};

    angular.forEach(moduleMetaData.configurations, function(name) {
      var feature = _.find(self.module.configurations, { name: name });

      if (!feature) {
        feature = { name: name };
        self.module.configurations.push(feature);
      }

      self.configurations[name] = feature;
    });
  }

  self.setHome = function(event) {

    event.stopPropagation();

    if (moduleMetaData.homePage !== self.currentHomepage) {
      var currentHomePage = self.currentHomepage;

      self.currentHomepage = moduleMetaData.homePage;

      return asyncAction(ADMIN_DEFAULT_NOTIFICATION_MESSAGES, function() {
        return adminDomainConfigService.set(domainId, HOMEPAGE_KEY, moduleMetaData.homePage);
      }).catch(function() {
        $timeout(function() {
          self.currentHomepage = currentHomePage;
        }, timeoutDuration);
      });
    }
  };

  self.isHomePage = function() {
    return self.currentHomepage === moduleMetaData.homePage;
  };

  self.save = function() {
    var modules = [];

    modules.push(self.module);

    return asyncAction(ADMIN_DEFAULT_NOTIFICATION_MESSAGES, function() {
      return adminModulesService.set(domainId, modules).then(function() {
        $scope.$broadcast(ADMIN_FORM_EVENT.submit);
        $scope.form.$setPristine();
      });
    });
  };

  self.reset = function() {
    $scope.$broadcast(ADMIN_FORM_EVENT.reset);
    $scope.form.$setPristine();
  };
});
