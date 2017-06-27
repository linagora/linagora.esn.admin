'use strict';

angular.module('linagora.esn.admin')

.component('adminMailSmtp', {
  templateUrl: '/admin/app/mail/transport/admin-mail-smtp.html',
  bindings: {
    transportConfig: '=',
    form: '='
  }
});
