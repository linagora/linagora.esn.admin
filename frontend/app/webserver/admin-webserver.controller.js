(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminWebserverController', adminWebserverController);

  function adminWebserverController(adminDomainConfigService, asyncAction, ADMIN_DEFAULT_NOTIFICATION_MESSAGES, ADMIN_LOADING_STATUS, ADMIN_MODE) {
    var self = this;
    var CONFIG_NAME = 'webserver';

    self.$onInit = $onInit;
    self.save = save;

    function $onInit() {
      self.status = ADMIN_LOADING_STATUS.loading;

      adminDomainConfigService.get(ADMIN_MODE.platform, CONFIG_NAME)
        .then(function(data) {
          self.config = data;
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
      return adminDomainConfigService.set(ADMIN_MODE.platform, CONFIG_NAME, self.config);
    }
  }
})(angular);
