(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminDomainsFormController', adminDomainsFormController);

  function adminDomainsFormController($q, domainAPI) {
    var self = this;

    self.uniqueDomainName = uniqueDomainName;

    function uniqueDomainName(domainName) {
      if (!domainName) {
        return $q.reject(new Error('Domain name required'));
      }

      return domainAPI.getByName(domainName)
        .then(function(domain) {
          if (domain) {
            return $q.reject(new Error('Domain already exists'));
          }
        });
    }
  }
})(angular);
