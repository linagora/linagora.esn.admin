(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminDomainsController', adminDomainsController);

  function adminDomainsController($modal) {
    var self = this;

    self.openCreateForm = openCreateForm;

    function openCreateForm() {
      $modal({
        templateUrl: '/admin/app/domains/create/admin-domains-create.html',
        backdrop: 'static',
        placement: 'center',
        controllerAs: '$ctrl',
        controller: 'adminDomainsCreateController'
      });
    }
  }
})(angular);
