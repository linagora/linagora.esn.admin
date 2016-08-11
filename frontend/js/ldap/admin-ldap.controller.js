'use strict';

angular.module('linagora.esn.admin')

.controller('adminLdapController', function($stateParams, adminDomainConfigService, asyncAction, rejectWithErrorNotification, _) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'ldap';
  var oldConfigs;

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      if (!data) {
        self.configs = [];
      } else {
        if (!_.isArray(data)) {
          self.configs = [data];
        } else {
          self.configs = data;
        }
      }

      oldConfigs = angular.copy(self.configs);
    });

  self.save = function(form) {
    var configs = _qualifyConfigs();

    if (angular.equals(oldConfigs, configs)) {
      return rejectWithErrorNotification('Nothing change to update!');
    }

    if (form && form.$valid) {
      return asyncAction('Modification of LDAP Server settings', function() {
        return _saveConfiguration(configs);
      })
      .then(function() {
        self.configs = configs;
        oldConfigs = angular.copy(configs);
      });
    }

    return rejectWithErrorNotification('Form is invalid!');
  };

  self.addForm = function() {
    self.configs.push({});
  };

  function _qualifyConfigs() {
    var currentConfigs =  self.configs;

    if (currentConfigs && currentConfigs.length) {
      return currentConfigs.filter(function(configObject) {
        if (configObject && configObject.name && !configObject.deleted) {
          delete configObject.deleted;
          return configObject;
        }
      });
    }
  }

  function _saveConfiguration(configs) {
    return adminDomainConfigService.set(domainId, {
      name: CONFIG_NAME,
      value: configs
    });
  }
});
