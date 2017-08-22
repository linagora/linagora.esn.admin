(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .factory('adminDomainsService', adminDomainsService);

  function adminDomainsService(
    $rootScope,
    $q,
    asyncAction,
    adminDomainConfigService,
    adminJamesClientProvider,
    domainAPI,
    ADMIN_DOMAINS_EVENTS,
    ADMIN_MODE
  ) {
    var CONFIG_NAME = 'james';

    return {
      create: create,
      update: update
    };

    function create(domain) {
      if (!domain) {
        return $q.reject(new Error('Domain is required'));
      }

      var notificationMessages = {
        progressing: 'Creating domain...',
        success: 'Domain created',
        failure: 'Failed to create domain'
      };

      return asyncAction(notificationMessages, function() {
        return _createDomain(domain);
      }).then(function(createdDomain) {
        $rootScope.$broadcast(ADMIN_DOMAINS_EVENTS.DOMAIN_CREATED, createdDomain);
      });
    }

    function update(domain) {
      var notificationMessages = {
        progressing: 'Updating domain...',
        success: 'Domain updated',
        failure: 'Failed to update domain'
      };

      return asyncAction(notificationMessages, function() {
        return domainAPI.update(domain);
      }).then(function() {
        $rootScope.$broadcast(ADMIN_DOMAINS_EVENTS.DOMAIN_UPDATED, domain);
      });
    }

    function _createDomain(domain) {
      return domainAPI.create(domain)
        .then(function(response) {
          return _createDomainInJames(domain.name)
            .then(function() {
              return response.data;
            });
        });
    }

    function _createDomainInJames(domainName) {
      return _getJamesServerURL()
        .then(function(serverUrl) {
          return _getJamesClient(serverUrl)
            .then(function(jamesClient) {
              return jamesClient.createDomain(domainName);
            });
        });
    }

    function _getJamesServerURL() {
      return adminDomainConfigService.get(ADMIN_MODE.platform, CONFIG_NAME)
        .then(function(data) {
          return data ? data.url : null;
        });
    }

    function _getJamesClient(serverUrl) {
      return adminJamesClientProvider
        .get(serverUrl);
    }
  }

})(angular);
