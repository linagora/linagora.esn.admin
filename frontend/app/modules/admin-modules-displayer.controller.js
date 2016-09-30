'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesDisplayerController', function($stateParams, $timeout, ADMIN_MODULES, _, adminDomainConfigService, rejectWithErrorNotification) {
  var self = this;
  var moduleMetaData = ADMIN_MODULES[self.module.name];
  var domainId = $stateParams.domainId;
  var HOMEPAGE_KEY = 'homePage';
  var timeoutDuration = 500;

  self.title = moduleMetaData.title;
  self.template = moduleMetaData.template;
  self.hasConfiguration = moduleMetaData.configurations.length > 0;
  self.icon = moduleMetaData.icon;
  self.isEnabled = true;
  self.configurations = {};

  self.setHome = function(event) {

    event.stopPropagation();

    if (moduleMetaData.homePage !== self.currentHomepage) {
      var currentHomePage = self.currentHomepage;

      self.currentHomepage = moduleMetaData.homePage;

      return adminDomainConfigService.set(domainId, HOMEPAGE_KEY, moduleMetaData.homePage)
      .catch(function() {
        rejectWithErrorNotification('Failed to set ' + moduleMetaData.title + ' as home');

        $timeout(function() {
          self.currentHomepage = currentHomePage;
        }, timeoutDuration);
      });
    }
  };

  self.isHomePage = function() {
    return self.currentHomepage === moduleMetaData.homePage;
  };

  angular.forEach(moduleMetaData.configurations, function(name) {
    var feature = _.find(self.module.configurations, { name: name });

    if (!feature) {
      feature = { name: name };
      self.module.configurations.push(feature);
    }

    self.configurations[name] = feature;
  });

});
