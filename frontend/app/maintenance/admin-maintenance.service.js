(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .factory('adminMaintenanceService', adminMaintenanceService);

  function adminMaintenanceService(asyncAction, adminRestangular) {
    var ACTIONS = {
      reindex: 'reindex',
      reconfigure: 'reconfigure'
    };
    var RESOURCE_TYPES = {
      users: 'users'
    };

    return {
      reindexUsers: reindexUsers,
      reconfigureUsersIndex: reconfigureUsersIndex
    };

    function reindexUsers() {
      var notificationMessages = {
        progressing: 'Submitting reindexing users request...',
        success: 'Request submitted',
        failure: 'Failed to submit request'
      };

      return asyncAction(notificationMessages, function() {
        var queryParams = {
          action: ACTIONS.reindex,
          resource_type: RESOURCE_TYPES.users
        };

        return _callElasticsearchIndexAPI(queryParams);
      });
    }

    function reconfigureUsersIndex() {
      var notificationMessages = {
        progressing: 'Submitting reconfiguration user index request...',
        success: 'Request submitted',
        failure: 'Failed to submit request'
      };

      return asyncAction(notificationMessages, function() {
        var queryParams = {
          action: ACTIONS.reconfigure,
          resource_type: RESOURCE_TYPES.users
        };

        return _callElasticsearchIndexAPI(queryParams);
      });
    }

    function _callElasticsearchIndexAPI(queryParams) {
      return adminRestangular
        .all('maintenance')
        .one('elasticsearch')
        .post(null, null, queryParams);
    }
  }
})(angular);
