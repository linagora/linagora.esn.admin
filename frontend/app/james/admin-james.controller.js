'use strict';

angular.module('linagora.esn.admin')

.controller('adminJamesController', function($stateParams, adminDomainConfigService, asyncAction, adminJamesClientProvider) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'james';

  self.save = save;
  self.test = test;

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data;
    });

  function save() {
    return asyncAction('Modification of James settings', _saveConfiguration);
  }

  function test() {
    adminJamesClientProvider
      .get(domainId)
      .then(function(jameClient) {
        jameClient.listDomains();
      })
      .catch(function(err) {
        console.log(111, err);
      });
  }

  function _saveConfiguration() {
    return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
  }
});
