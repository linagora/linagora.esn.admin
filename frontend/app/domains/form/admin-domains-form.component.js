(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminDomainsForm', {
    templateUrl: '/admin/app/domains/form/admin-domains-form.html',
    bindings: {
      updateMode: '<',
      domain: '='
    }
  });
})(angular);
