(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminDomainsListController', adminDomainsListController);

  function adminDomainsListController($scope, $q, domainAPI, infiniteScrollHelper, ADMIN_DOMAINS_EVENTS) {
    var self = this;
    var DEFAULT_LIMIT = 20;

    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.$onInit = $onInit;

    function $onInit() {
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);

      $scope.$on(ADMIN_DOMAINS_EVENTS.DOMAIN_CREATED, function(event, domain) {
        _onDomainCreated(domain);
      });
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return domainAPI.list(options)
        .then(function(response) {
          return response.data;
        });
    }

    function _onDomainCreated(newDomain) {
      if (!newDomain) {
        return;
      }

      self.elements.unshift(newDomain);
    }
  }
})(angular);
