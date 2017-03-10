'use strict';

angular.module('linagora.esn.admin')

.controller('adminJamesController', function($stateParams, $timeout, adminDomainConfigService, asyncAction, adminJamesClientProvider) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'james';

  self.save = save;
  self.test = test;
  self.quota = {};
  self.setQuota = setQuota;
  self.$onInit = $onInit;

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data;
    });

  function $onInit() {
    getQuota();
  }

  function getQuota() {
    adminJamesClientProvider
      .get(domainId)
      .then(function(jameClient) {
        $timeout(function() {
          jameClient.getQuota()
            .then(function(data) {
              self.quota = data;
            })
            .catch(function(err) {
              console.log(err);
            });
        });
      });
  }

  function setQuota(data) {
    adminJamesClientProvider
      .get(domainId)
      .then(function(jameClient) {
        jameClient.setQuota(data);
      });
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

  function save() {
    return asyncAction('Modification of James settings', _saveConfiguration);
  }

  function _saveConfiguration() {
    return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
  }
});
