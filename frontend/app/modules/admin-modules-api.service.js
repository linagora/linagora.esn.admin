'use strict';

angular.module('linagora.esn.admin')

.factory('adminModulesApi', function(adminConfigApi, esnModuleRegistry, _, ADMIN_MODULES) {
  var modulesMetadata;

  function getModuleMetadata(moduleName) {
    if (modulesMetadata) { return modulesMetadata[moduleName]; }

    modulesMetadata = esnModuleRegistry.getAll();

    angular.forEach(modulesMetadata, function(module, name) {
      _.assign(module, ADMIN_MODULES[name]);
    });

    return modulesMetadata[moduleName];
  }

  function get(domainId) {
    var query = [];

    angular.forEach(ADMIN_MODULES, function(module, name) {
      query.push({
        name: name,
        keys: module.configurations
      });
    });

    return adminConfigApi.get(domainId, query);
  }

  function set(domainId, query) {
    return adminConfigApi.set(domainId, query);
  }

  return {
    get: get,
    set: set,
    getModuleMetadata: getModuleMetadata
  };
});
