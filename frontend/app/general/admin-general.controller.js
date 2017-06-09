(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminGeneralController', adminGeneralController);

  function adminGeneralController($stateParams, adminDomainConfigService, asyncAction, adminModeService, _, ADMIN_DEFAULT_NOTIFICATION_MESSAGES) {
    var self = this;
    var domainId = $stateParams.domainId;
    var PLATFORM_CONFIG_NAMES = ['login', 'businessHours'];
    var DOMAIN_CONFIG_NAMES = ['businessHours'];
    var configNames;

    self.$onInit = $onInit;
    self.save = save;
    self.hasConfig = hasConfig;

    function $onInit() {
      configNames = _determineConfigNames();
      adminDomainConfigService.getMultiple(domainId, configNames)
        .then(function(data) {
          self.configs = data;
        });
    }

    function _determineConfigNames() {
      var configNames = adminModeService.isPlatformMode() ? PLATFORM_CONFIG_NAMES : DOMAIN_CONFIG_NAMES;

      return configNames;
    }

    function hasConfig(configName) {
      return configNames.indexOf(configName) > -1;
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
