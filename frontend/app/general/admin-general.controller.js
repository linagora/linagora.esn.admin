(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminGeneralController', adminGeneralController);

  function adminGeneralController(
    $stateParams,
    adminDomainConfigService,
    asyncAction,
    adminModeService,
    _,
    ADMIN_DEFAULT_NOTIFICATION_MESSAGES,
    ADMIN_GENERAL_CONFIG
  ) {
    var self = this;
    var domainId = $stateParams.domainId;
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
      var configNames = adminModeService.isPlatformMode() ? ADMIN_GENERAL_CONFIG.platform : ADMIN_GENERAL_CONFIG.domain;

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
