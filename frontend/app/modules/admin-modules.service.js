'use strict';

angular.module('linagora.esn.admin')

.factory('adminModulesService', function(adminConfigApi, esnModuleRegistry, _, ADMIN_MODULES) {
  var modulesMetadata;

  function _getModulesMetadata() {
    if (modulesMetadata) { return modulesMetadata; }

    modulesMetadata = _.cloneDeep(esnModuleRegistry.getAll());

    angular.forEach(modulesMetadata, function(module, name) {
      _.assign(module, ADMIN_MODULES[name]);
    });

    return modulesMetadata;
  }

  function getModuleMetadata(moduleName) {
    return _getModulesMetadata()[moduleName];
  }

  function get(domainId) {
    var query = [];
    var modulesMetadata = _getModulesMetadata();

    angular.forEach(modulesMetadata, function(module, name) {
      var keys = module.configurations || [];

      query.push({
        name: name,
        keys: keys
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
