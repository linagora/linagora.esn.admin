(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminAutoconfController', adminAutoconfController);

  function adminAutoconfController($stateParams, adminDomainConfigService, asyncAction, _, ADMIN_AUTOCONF_TEMPLATE, ADMIN_DEFAULT_NOTIFICATION_MESSAGES, ADMIN_LOADING_STATUS) {
    var self = this;
    var domainId = $stateParams.domainId;
    var CONFIG_NAME = 'autoconf';

    self.$onInit = $onInit;
    self.save = save;
    self.status = ADMIN_LOADING_STATUS.loading;

    function $onInit() {
      adminDomainConfigService.get(domainId, CONFIG_NAME)
        .then(function(data) {
          self.config = data || angular.copy(ADMIN_AUTOCONF_TEMPLATE);
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
      return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
    }
  }
})(angular);
