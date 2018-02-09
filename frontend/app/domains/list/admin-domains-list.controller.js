(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminDomainsListController', adminDomainsListController);

  function adminDomainsListController(
    $scope,
    $modal,
    $q,
    domainAPI,
    infiniteScrollHelper,
    _,
    asyncAction,
    jamesWebadminClient,
    ADMIN_DOMAINS_EVENTS
  ) {
    var self = this;
    var DEFAULT_LIMIT = 20;

    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.$onInit = $onInit;
    self.showEditDomainForm = showEditDomainForm;
    self.onFixBtnClick = onFixBtnClick;

    function $onInit() {
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems);
      self.errors = {};

      $scope.$on(ADMIN_DOMAINS_EVENTS.DOMAIN_CREATED, function(event, domain) {
        _onDomainCreated(domain);
      });

      $scope.$on(ADMIN_DOMAINS_EVENTS.DOMAIN_UPDATED, function(event, updatedDomain) {
        _onDomainUpdated(updatedDomain);
      });
    }

    function showEditDomainForm(domain) {
      var updateDomainModal = $modal({
        templateUrl: '/admin/app/domains/update/admin-domains-update.html',
        backdrop: 'static',
        placement: 'center',
        controller: 'adminDomainUpdateController',
        controllerAs: '$ctrl',
        locals: {
          domain: domain
        },
        show: false
      });

      // ensure template has been loaded
      updateDomainModal.$promise.then(updateDomainModal.show);
    }

    function onFixBtnClick(domain) {
      var notificationMessages = {
        progressing: 'Fixing...',
        success: 'Fixed',
        failure: 'Cannot fix, please check your James configuration'
      };

      return asyncAction(notificationMessages, function() {
        return _checkJamesDomainAvailabilities([domain]) // try to check again
          .then(function() {
            if (self.errors[domain.id]) {
              return $q.reject(new Error(self.errors[domain.id]));
            }
          })
          .catch(function() {
            // try to create domain
            return jamesWebadminClient.createDomain(domain.name);
          })
          .then(function() {
            delete self.errors[domain.id];
          });
      });
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return domainAPI.list(options)
        .then(function(response) {
          var domains = response.data;

          _checkJamesDomainAvailabilities(domains);

          return domains;
        });
    }

    function _onDomainCreated(newDomain) {
      if (!newDomain) {
        return;
      }

      _checkJamesDomainAvailabilities([newDomain]);
      self.elements.unshift(newDomain);
    }

    function _onDomainUpdated(updatedDomain) {
      if (!updatedDomain || !updatedDomain.id) {
        return;
      }

      _checkJamesDomainAvailabilities([updatedDomain]);

      var index = _.findIndex(self.elements, { id: updatedDomain.id });

      if (index !== -1) {
        self.elements[index] = updatedDomain;
      }
    }

    function _checkJamesDomainAvailabilities(domains) {
      return jamesWebadminClient
        .listDomains()
        .catch(function() {
          return [];
        })
        .then(function(jamesDomains) {
          domains.forEach(function(domain) {
            if (jamesDomains.indexOf(domain.name) > -1) {
              delete self.errors[domain.id];
            } else {
              self.errors[domain.id] = 'Could not find the corresponding domain in James server.';
            }
          });

          return self.errors;
        });
    }
  }
})(angular);
