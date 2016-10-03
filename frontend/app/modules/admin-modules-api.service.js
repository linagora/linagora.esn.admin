'use strict';

angular.module('linagora.esn.admin')

.factory('adminModulesApi', function(adminConfigApi, ADMIN_MODULES) {
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
    set: set
  };
});
