'use strict';

angular.module('linagora.esn.admin')

.constant('ADMIN_SEARCH_LIMIT', 20)

.factory('adminRolesService', function($q, domainAPI, domainSearchMembersProvider, ADMIN_SEARCH_LIMIT, DEFAULT_TEMPLATE_URL, _) {
  var domainId;
  var administrators;

  function init(_domainId) {
    domainId = _domainId;
  }

  function reset() {
    domainId = null;
    administrators = null;
  }

  function getAdministrators() {
    if (administrators) {
      return $q.when(administrators);
    }

    return domainAPI.getAdministrators(domainId).then(function(resp) {
      administrators = resp.data;

      return administrators;
    });
  }

  function addAdministrators(_administrators) {
    var administratorIds = _administrators.map(_.property('_id'));

    return domainAPI.addAdministrators(domainId, administratorIds)
      .then(function() {
        Array.prototype.push.apply(administrators, _administrators);
      });
  }

  function searchAdministratorCandidates(query) {
    return domainSearchMembersProvider.get(domainId).searchAttendee(query, ADMIN_SEARCH_LIMIT)
      .then(function(attendees) {
        return attendees.map(function(attendee) {
          return angular.extend(attendee, { templateUrl: DEFAULT_TEMPLATE_URL });
        });
      }, _.constant([]))
      .then(function(users) {
        return users.map(function(user) {
            if (!_.find(administrators, {_id: user._id})) {
              user.name = user.name || user.displayName || user.email;

              return user;
            }
          }).filter(Boolean);
      });
  }

  return {
    init: init,
    reset: reset,
    getAdministrators: getAdministrators,
    addAdministrators: addAdministrators,
    searchAdministratorCandidates: searchAdministratorCandidates
  };
});
