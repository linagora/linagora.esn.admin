(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .constant('ADMIN_USER_ACTIONS', {
    login: {
      name: 'login',
      label: 'Login'
    }
  })

  .constant('ADMIN_USER_ACTION_STATES', {
    disabled: 'disabled',
    enabled: 'enabled'
  });
})(angular);
