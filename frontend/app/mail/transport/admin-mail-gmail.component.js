'use strict';

angular.module('linagora.esn.admin')

.component('adminMailGmail', {
  templateUrl: '/admin/app/mail/transport/admin-mail-gmail.html',
  bindings: {
    transportConfig: '=',
    form: '='
  }
});
