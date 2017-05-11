(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminAutoconfController', adminAutoconfController);

  function adminAutoconfController($stateParams, adminDomainConfigService, asyncAction, _, ADMIN_AUTOCONF_TEMPLATE) {
    var self = this;
    var domainId = $stateParams.domainId;
    var CONFIG_NAME = 'autoconf';

    self.$onInit = $onInit;
    self.save = save;

    function $onInit() {
      adminDomainConfigService.get(domainId, CONFIG_NAME)
        .then(function(data) {
          self.config = data || angular.copy(ADMIN_AUTOCONF_TEMPLATE);
        });
    }

    function save() {
      return asyncAction('Modification of Autoconf settings', _saveConfiguration);
    }

    function _saveConfiguration() {
      return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
    }
  }
})(angular);
