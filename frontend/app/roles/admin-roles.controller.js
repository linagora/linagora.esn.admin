'use strict';

angular.module('linagora.esn.admin')

.controller('adminRolesController', function($scope, $stateParams, $modal, adminRolesService) {
  var self = this;
  var domainId = $stateParams.domainId;

  init();

  function init() {
    adminRolesService.init(domainId);

    adminRolesService.getAdministrators().then(function(administrators) {
      self.administrators = administrators;
    });
  }

  self.openAddForm = function() {
    $modal({
      templateUrl: '/admin/app/roles/add/admin-roles-add.html',
      backdrop: 'static',
      placement: 'center',
      controllerAs: '$ctrl',
      controller: 'adminRolesAddController'
    });
  };

  $scope.$on('$destroy', function() {
    adminRolesService.reset();
  });
});
