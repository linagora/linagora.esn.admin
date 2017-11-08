(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

    .component('adminDomainsFormHostnames', {
      templateUrl: '/admin/app/domains/form/hostnames/admin-domains-form-hostnames.html',
      bindings: {
        domain: '=',
        form: '<'
      },
      controller: 'adminDomainsHostnamesController'
    });
})(angular);
