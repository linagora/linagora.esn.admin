'use strict';

angular.module('linagora.esn.admin')

.component('adminDavSubheader', {
  templateUrl: '/admin/app/dav/admin-dav-subheader',
  bindings: {
    onFormSubmit: '&',
    form: '<'
  }
});
