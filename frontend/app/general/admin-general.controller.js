(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminGeneralController', adminGeneralController);

  function adminGeneralController($stateParams, adminDomainConfigService, asyncAction, _, ADMIN_DEFAULT_NOTIFICATION_MESSAGES) {
    var self = this;
    var domainId = $stateParams.domainId;
    var CONFIG_NAMES = ['login'];

    self.$onInit = $onInit;
    self.save = save;

    function $onInit() {
      adminDomainConfigService.getMultiple(domainId, CONFIG_NAMES)
        .then(function(data) {
          self.configs = data;
        });
    }

    function save() {
      return asyncAction(ADMIN_DEFAULT_NOTIFICATION_MESSAGES, _saveConfiguration);
    }

    function _saveConfiguration() {
      var qualifiedConfigs = _qualifyConfigs(self.configs);

      return adminDomainConfigService.setMultiple(domainId, qualifiedConfigs);
    }

    function _qualifyConfigs(configs) {
      var qualifiedConfigs = [];

      _.forEach(configs, function(value, key) {
        qualifiedConfigs.push({ name: key, value: value });
      });

      return qualifiedConfigs;
    }
  }
})(angular);
