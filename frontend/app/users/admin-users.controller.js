'use strict';

angular.module('linagora.esn.admin')

.controller('adminUsersController', function($stateParams) {
  var self = this;
  self.domainId = $stateParams.domainId;
});
