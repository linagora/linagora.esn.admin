'use-strict';

angular.module('linagora.esn.admin')

.directive('adminFormMultiInput', function() {

  return {
    restrict: 'E',
    templateUrl: '/admin/app/common/form/admin-form-multi-input.html',
    controller: 'adminFormMultiInputController',
    controllerAs: '$ctrl',
    scope: {
      ngModel: '=',
      availableTypes: '=',
      requiredTypes: '='
    }
  };
});
