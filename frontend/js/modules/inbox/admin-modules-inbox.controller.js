'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesInboxController', function() {
  var self = this;

  self.isCollapsed = true;
  self.isEnabled = true;
  self.isHomePage = true;

  self.features.forEach(function(configuration) {
    self[configuration.name] = configuration;
  });
});
