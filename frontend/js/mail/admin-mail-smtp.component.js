'use strict';

angular.module('linagora.esn.admin')

.component('adminMailSmtp', {
  templateUrl: '/admin/views/mail/admin-mail-smtp',
  bindings: {
    transportConfig: '<'
  }
});
