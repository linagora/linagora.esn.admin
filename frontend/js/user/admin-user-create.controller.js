'use strict';

angular.module('linagora.esn.admin')

.controller('adminUserCreateController', function($stateParams, adminUserService, rejectWithErrorNotification) {
  var self = this;
  var domainId = $stateParams.domainId;
  var USER_TEMPLATE = {
    accounts: [{
      type: 'email',
      emails: []
    }],
    domains: [
      { domain_id: domainId }
    ]
  };

  self.user = $stateParams.user || angular.copy(USER_TEMPLATE);

  self.save = function(form) {
    if (form && form.$valid) {
      return adminUserService.createMember(domainId, self.user)
        .then(function() {
          // Reset form state
          self.user = angular.copy(USER_TEMPLATE);
          form.$setPristine();
        });
    }

    return rejectWithErrorNotification('Form is invalid!');
  };
});
