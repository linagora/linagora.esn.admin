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
    ADMIN_GENERAL_CONFIG,
    ADMIN_LOADING_STATUS
  ) {
    var self = this;
    var domainId = $stateParams.domainId;
    var configNames;

    self.$onInit = $onInit;
    self.save = save;
    self.hasConfig = hasConfig;
    self.status = ADMIN_LOADING_STATUS.loading;

    function $onInit() {
      configNames = _determineConfigNames();
      adminDomainConfigService.getMultiple(domainId, configNames)
        .then(function(data) {
          self.configs = data;
          self.status = ADMIN_LOADING_STATUS.loaded;
        })
        .catch(function() {
          self.status = ADMIN_LOADING_STATUS.error;
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
