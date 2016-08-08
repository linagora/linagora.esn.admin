'use strict';

/* global _: false */

angular.module('esn.router', ['ui.router'])
  .factory('session', function($q) {
    return {
      ready: $q.when(),
      user: {},
      domain: {},
      userIsDomainAdministrator: function() {
        return false;
      }
    };
  });
angular.module('esn.session', []);
angular.module('esn.subheader', []);
angular.module('esn.sidebar', []);
angular.module('esn.async-action', [])
  .factory('asyncAction', function() {
    return function(message, action) {
      return action();
    };
  });
angular.module('esn.core', [])
  .constant('_', _);
