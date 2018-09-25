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
    ADMIN_LOADING_STATUS
  ) {
    var self = this;
    var domainId = $stateParams.domainId;

    self.$onInit = $onInit;
    self.save = save;
    self.status = ADMIN_LOADING_STATUS.loading;

    function $onInit() {
      adminDomainConfigService.getMultiple(domainId, ['businessHours', 'datetime', 'language'])
        .then(function(data) {
          self.configs = data;
          self.status = ADMIN_LOADING_STATUS.loaded;
        })
        .catch(function() {
          self.status = ADMIN_LOADING_STATUS.error;
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
