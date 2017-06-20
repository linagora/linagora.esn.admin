(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminDomainsItem', {
    templateUrl: '/admin/app/domains/item/admin-domains-item',
    bindings: {
      domain: '<'
    }
  });
})(angular);
