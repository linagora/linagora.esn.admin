'use strict';

angular.module('linagora.esn.admin')

.component('adminMailSubheader', {
  templateUrl: '/admin/views/mail/admin-mail-subheader',
  bindings: {
    onSaveButtonClick: '&'
  }
});
