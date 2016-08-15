'use strict';

angular.module('linagora.esn.admin')

.component('adminMailLocal', {
  templateUrl: '/admin/views/mail/admin-mail-local',
  bindings: {
    transport: '<',
    form: '='
  }
});
