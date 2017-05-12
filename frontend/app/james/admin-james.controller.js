(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminJamesController', adminJamesController);

  function adminJamesController($stateParams, $q, adminDomainConfigService, asyncAction, adminJamesClientProvider, ADMIN_DEFAULT_NOTIFICATION_MESSAGES) {
    var self = this;
    var domainId = $stateParams.domainId;
    var CONFIG_NAME = 'james';
    var ACTION_DEFAULT_VALUE = { get: null, set: -1 };

    self.$onInit = $onInit;
    self.save = save;
    self.connect = connect;
    self.onServerUrlChange = onServerUrlChange;

    function $onInit() {
      self.connectionStatus = 'connecting';

      adminDomainConfigService.get(domainId, CONFIG_NAME)
        .then(function(data) {
          data = data || {};

          self.serverUrl = data.url;
        })
        .then(getJamesConfigurations)
        .then(function() {
          self.connectionStatus = 'connected';
        })
        .catch(function() {
          self.connectionStatus = 'error';
          self.config = {};
        });
    }

    function connect() {
      if (!self.serverUrl) { return $q.when(); }

      self.connectionStatus = 'connecting';

      return getJamesConfigurations()
        .then(_saveJamesUrl)
        .then(function() {
          self.connectionStatus = 'connected';
        })
        .catch(function() {
          self.connectionStatus = 'error';
          self.config = {};
        });
    }

    function onServerUrlChange(configForm) {
      self.connectionStatus = '';
      self.config = {};

      if (configForm) {
        configForm.$setPristine();
      }
    }

    function save() {
      return asyncAction(ADMIN_DEFAULT_NOTIFICATION_MESSAGES, _saveJamesConfigurations);
    }

    function getJamesConfigurations() {
      return adminJamesClientProvider
        .get(domainId, self.serverUrl)
        .then(function(jamesClient) {
          return $q.all([
            jamesClient.getQuota()
          ]).then(function(data) {
            var config = {
              quota: data[0]
            };

            self.config = _qualifyJamesConfig(config);
          });
        });
    }

    function _saveJamesUrl() {
      return adminDomainConfigService.set(domainId, CONFIG_NAME, { url: self.serverUrl });
    }

    function _saveJamesConfigurations() {
      var config = _qualifyJamesConfig(self.config, ACTION_DEFAULT_VALUE.set);

      return adminJamesClientProvider
        .get(domainId, self.serverUrl)
        .then(function(jamesClient) {
          return $q.all([
            jamesClient.setQuota(config.quota)
          ]);
        });
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
