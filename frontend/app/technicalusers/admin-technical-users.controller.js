(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .controller('adminTechnicalUsersController', function($log, $scope, $stateParams) {
    $scope.domainId = $stateParams.domainId;
  });

})(angular);
