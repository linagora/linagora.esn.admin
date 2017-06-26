'use strict';

angular.module('linagora.esn.admin')

.component('adminWebSubheader', {
  templateUrl: '/admin/app/web/admin-web-subheader.html',
  bindings: {
    onFormSubmit: '&',
    form: '<'
  }
});
