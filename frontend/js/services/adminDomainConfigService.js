'use strict';

angular.module('linagora.esn.admin')

.service('adminDomainConfigService', function(adminRestangular, _) {
  function get(domainId, configNames, moduleName) {
    var isArray = true;

    if (!_.isArray(configNames)) {
      configNames = [configNames];
      isArray = false;
    }

    var body = { configNames: configNames, moduleName: moduleName };

    return adminRestangular
      .all('configuration')
      .one('domain', domainId)
      .customPOST(body)
      .then(function(response) {
        if (response.status !== 200) {
          return $q.reject(response);
        }

        if (!isArray) {
          return response.data.length ? response.data[0].value : null;
        }

        return response.data;
      });
  }

  function set(domainId, configs, moduleName) {
    if (!_.isArray(configs)) {
      configs = [configs];
    }

    var body = { configs: configs, moduleName: moduleName };

    return adminRestangular
      .all('configuration')
      .one('domain', domainId)
      .customPUT(body)
      .then(function() {
        return configs;
      });
  }

  return {
    get: get,
    set: set
  };
});
