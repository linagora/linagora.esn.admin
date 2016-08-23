'use strict';

angular.module('linagora.esn.admin')

.component('adminMailTest', {
  templateUrl: '/admin/views/mail/admin-mail-test',
  controller: 'adminMailTestController',
  bindings: {
    config: '<',
    transportType: '=',
    isMailConfigValid: '='
  }
});
