(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .controller('adminOauthController', function($stateParams, adminDomainConfigService, asyncAction) {
    var self = this;
    var domainId = $stateParams.domainId;
    var CONFIG_NAME = 'oauth';

    self.$onInit = $onInit;
    self.save = save;

    function $onInit() {
      adminDomainConfigService.get(domainId, CONFIG_NAME)
        .then(function(config) {
          self.config = config;
        });
    }

    function save() {
      return asyncAction('Modification of social configuration', _saveConfiguration);
    }

    function _saveConfiguration() {
      return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
    }
  });
})(angular);
