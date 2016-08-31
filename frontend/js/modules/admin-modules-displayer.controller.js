'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesDisplayerController', function(ADMIN_MODULES, _) {
  var self = this;
  var moduleMetaData = ADMIN_MODULES[self.module.name];

  self.title = moduleMetaData.title;
  self.template = moduleMetaData.template;
  self.isEnabled = true;
  self.isHomePage = true;
  self.configurations = {};

  angular.forEach(moduleMetaData.configurations, function(name) {
    var feature =  _.find(self.module.configurations, { name: name });

    if (!feature) {
      feature = { name: name };
      self.module.configurations.push(feature);
    }

    self.configurations[name] = feature;
  });

});
