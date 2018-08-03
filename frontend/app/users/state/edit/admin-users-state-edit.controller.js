(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('AdminUsersStateEditController', AdminUsersStateEditController);

  function AdminUsersStateEditController(
    asyncAction,
    userUtils,
    adminUsersStateService,
    user,
    ADMIN_USER_ACTION_STATES
  ) {
    var self = this;

    self.init = init;
    self.updateUserStates = updateUserStates;

    function init() {
      user.states = user.states || [];
      self.username = userUtils.displayNameOf(user);
      self.states = _qualifyStatesToView(adminUsersStateService.getUserStates(user));
    }

    function updateUserStates() {
      var notificationMessages = {
        progressing: 'Updating user states...',
        success: 'User states updated',
        failure: 'Failed to update user states'
      };

      return asyncAction(notificationMessages, function() {
        return adminUsersStateService.setUserStates(user._id, _qualifyStatesToUpdate(self.states));
      });
    }

    function _qualifyStatesToUpdate(states) {
      var statesToUpdate = angular.copy(states);

      return statesToUpdate.map(function(state) {
        state.value = state.value ? ADMIN_USER_ACTION_STATES.enabled : ADMIN_USER_ACTION_STATES.disabled;

        return state;
      });
    }

    function _qualifyStatesToView(states) {
      var statesToView = angular.copy(states);

      return statesToView.map(function(state) {
        state.value = state.value === ADMIN_USER_ACTION_STATES.enabled;

        return state;
      });
    }
  }
})(angular);
