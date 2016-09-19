'use strict';

angular.module('linagora.esn.admin')

.controller('adminRolesController', function($stateParams, domainAPI) {
  var self = this;
  var domainId = $stateParams.domainId;

  domainAPI.getAdministrators(domainId).then(function(resp) {
    self.administrators = resp.data;
  });
});
