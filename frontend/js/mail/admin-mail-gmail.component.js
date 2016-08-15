'use strict';

angular.module('linagora.esn.admin')

.component('adminMailGmail', {
  templateUrl: '/admin/views/mail/admin-mail-gmail',
  bindings: {
    transportConfig: '<',
    form: '='
  }
});
