'use strict';

angular.module('linagora.esn.admin')

.component('adminMailLocal', {
  templateUrl: '/admin/app/mail/transport/admin-mail-local',
  bindings: {
    transport: '=',
    form: '='
  }
});
