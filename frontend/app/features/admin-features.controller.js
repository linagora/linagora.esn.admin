(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminFeaturesController', adminFeaturesController);

  function adminFeaturesController(
    $stateParams,
    asyncAction,
    adminFeaturesService,
    adminDomainConfigService,
    ADMIN_DEFAULT_NOTIFICATION_MESSAGES
  ) {
    var self = this;
    var domainId = $stateParams.domainId;
    var CONFIG_NAME = 'features';

    self.$onInit = $onInit;
    self.save = save;

    function $onInit() {
      adminDomainConfigService.get(domainId, CONFIG_NAME)
        .then(function(config) {
          self.features = adminFeaturesService.includeFeaturesMetadata(config);
        });
    }

    function save() {
      return asyncAction(ADMIN_DEFAULT_NOTIFICATION_MESSAGES, _saveConfiguration);
    }

    function _saveConfiguration() {
      var featuresConfig = adminFeaturesService.getFeaturesConfigValue(self.features);

      return adminDomainConfigService.set(domainId, CONFIG_NAME, featuresConfig);
    }
  }
})(angular);
