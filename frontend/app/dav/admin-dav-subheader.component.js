'use strict';

angular.module('linagora.esn.admin')

.component('adminDavSubheader', {
  templateUrl: '/admin/app/dav/admin-dav-subheader.html',
  bindings: {
    onFormSubmit: '&',
    form: '<'
  }
});
