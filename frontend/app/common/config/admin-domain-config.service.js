'use strict';

angular.module('linagora.esn.admin')

.factory('adminDomainConfigService', function(adminConfigApi, _) {
  var DEFAULT_MODULE = 'core';

  function get(domainId, key) {
    var query = [{
      name: DEFAULT_MODULE,
      keys: [key]
    }];

    return adminConfigApi.get(domainId, query).then(function(modules) {
      var module = _.find(modules, { name: DEFAULT_MODULE });
      var config = module && _.find(module.configurations, { name: key });

      return config && config.value;
    });
  }

  function set(domainId, key, value) {
    var query = [{
      name: DEFAULT_MODULE,
      configurations: [{
        name: key,
        value: value
      }]
    }];

    return adminConfigApi.set(domainId, query);
  }

  return {
    get: get,
    set: set
  };
});
