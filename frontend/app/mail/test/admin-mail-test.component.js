'use strict';

angular.module('linagora.esn.admin')

.component('adminMailTest', {
  templateUrl: '/admin/app/mail/test/admin-mail-test.html',
  controller: 'adminMailTestController',
  bindings: {
    config: '<',
    transportType: '=',
    isMailConfigValid: '='
  }
});
