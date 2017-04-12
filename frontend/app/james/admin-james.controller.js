(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminJamesController', adminJamesController);

  function adminJamesController($stateParams, $q, adminDomainConfigService, asyncAction, adminJamesClientProvider) {
    var self = this;
    var domainId = $stateParams.domainId;
    var CONFIG_NAME = 'james';
    var ACTION_DEFAULT_VALUE = { get: null, set: -1 };

    self.$onInit = $onInit;
    self.save = save;
    self.connect = connect;
    self.onServerUrlChange = onServerUrlChange;

    self.connectionStatus = '';

    function $onInit() {
      adminDomainConfigService.get(domainId, CONFIG_NAME)
        .then(function(data) {
          data = data || {};
          self.serverUrl = data.url;
        })
        .then(connect);
    }

    function connect() {
      if (!self.serverUrl) { return $q.when(); }

      self.connectionStatus = 'connecting';

      return getJamesConfigurations()
        .then(function(data) {
          self.connectionStatus = 'connected';
          var config = {
            quota: data[0]
          };

          self.config = _qualifyJamesConfig(config);
        })
        .catch(function() {
          self.connectionStatus = 'error';
          self.config = {};

          return $q.reject();
        });
    }

    function onServerUrlChange() {
      self.connectionStatus = '';
      self.config = {};
    }

    function save() {
      return asyncAction('Modification of James settings', _saveConfiguration);
    }

    function getJamesConfigurations() {
      return adminJamesClientProvider
        .get(domainId, self.serverUrl)
        .then(function(jamesClient) {
          return $q.all([
            jamesClient.getQuota()
          ]);
        });
    }

    function setJamesConfigurations() {
      var config = _qualifyJamesConfig(self.config, ACTION_DEFAULT_VALUE.set);

      return adminJamesClientProvider
        .get(domainId, self.serverUrl)
        .then(function(jamesClient) {
          return $q.all([
            jamesClient.setQuota(config.quota)
          ]);
        });
    }

    function _saveConfiguration() {
      return $q.all([
        adminDomainConfigService.set(domainId, CONFIG_NAME, { url: self.serverUrl }),
        setJamesConfigurations()
      ]);
    }

    function _qualifyJamesConfig(config, defaultValue) {
      defaultValue = defaultValue || ACTION_DEFAULT_VALUE.get;
      var cf = angular.copy(config);

      if (cf.quota) {
        cf.quota.size = cf.quota.size > 0 ? cf.quota.size : defaultValue;
        cf.quota.count = cf.quota.count > 0 ? cf.quota.count : defaultValue;
      }

      return cf;
    }
  }
})(angular);
