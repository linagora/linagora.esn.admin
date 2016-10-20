'use strict';

angular.module('linagora.esn.admin')

.controller('adminUsersQuickFormController', function(adminUsersService, rejectWithErrorNotification) {
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
      return adminUsersService.createMember(self.domainId, self.user)
        .then(function() {
          // Reset form state
          self.user = angular.copy(USER_TEMPLATE);
          form.$setPristine();
        });
    }

    form.$setSubmitted();

    return rejectWithErrorNotification('Form is invalid!');
  };
});
