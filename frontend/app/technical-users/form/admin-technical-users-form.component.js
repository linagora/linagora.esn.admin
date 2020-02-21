(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminTechnicalUsersForm', {
    templateUrl: '/admin/app/technical-users/form/admin-technical-users-form.html',
    controller: 'adminTechnicalUsersFormController',
    bindings: {
      technicalUser: '='
    }
  });

})(angular);
