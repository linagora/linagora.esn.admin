'use strict';

angular.module('linagora.esn.admin')

.component('adminMailSubheader', {
  templateUrl: '/admin/app/mail/admin-mail-subheader',
  bindings: {
    onSaveButtonClick: '&',
    disableSaveButton: '<'
  }
});
