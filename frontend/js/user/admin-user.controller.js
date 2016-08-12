'use strict';

angular.module('linagora.esn.admin')

.controller('adminUserController', function($stateParams) {
  var self = this;
  self.domainId = $stateParams.domainId;
});
