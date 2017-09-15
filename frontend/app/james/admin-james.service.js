(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .factory('adminJamesService', adminJamesService);

  function adminJamesService(
    adminDomainConfigService,
    adminJamesClientProvider,
    ADMIN_MODE
  ) {
    var CONFIG_NAME = 'james';

    return {
      createDomain: createDomain,
      getServerUrl: getServerUrl,
      listDomains: listDomains
    };

    function createDomain(domainName) {
      return _getJamesClient()
        .then(function(jamesClient) {
          return jamesClient.createDomain(domainName);
        });
    }

    function getServerUrl() {
      return adminDomainConfigService.get(ADMIN_MODE.platform, CONFIG_NAME)
        .then(function(data) {
          return data && data.url;
        });
    }

    function listDomains() {
      return _getJamesClient()
        .then(function(jamesClient) {
          return jamesClient.listDomains();
        });
    }

    function _getJamesClient() {
      return getServerUrl()
        .then(adminJamesClientProvider.get);
    }
  }
})(angular);
