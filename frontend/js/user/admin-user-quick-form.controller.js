'use strict';

angular.module('linagora.esn.admin')

.controller('adminUserQuickFormController', function($q, adminUserService, rejectWithErrorNotification) {
  var self = this;

  var USER_TEMPLATE = {
    accounts: [{
      type: 'email',
      emails: []
    }],
    domains: [
      { domain_id: self.domainId }
    ]
  };

  self.user = angular.copy(USER_TEMPLATE);

  self.save = function(form) {
    if (form && form.$valid) {
      return adminUserService.createMember(self.domainId, self.user)
        .then(function() {
          // Reset form state
          self.user = angular.copy(USER_TEMPLATE);
          form.$setPristine();
        });
    }

    return rejectWithErrorNotification('Form is invalid!');
  };
});
