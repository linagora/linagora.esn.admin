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
angular.module('esn.infinite-list', []);
angular.module('esn.form.helper', []);
angular.module('esn.async-action', [])
  .factory('asyncAction', function() {
    return function(message, action) {
      return action();
    };
  })
  .factory('rejectWithErrorNotification', function() {
    return function() {
      return $q.reject();
    };
  });
angular.module('esn.core', [])
  .constant('_', _);
angular.module('esn.http', [])
  .factory('httpErrorHandler', function() {
    return {
      redirectToLogin: angular.noop
    };
  });
angular.module('esn.domain', [])
  .factory('domainAPI', function() {
    return {};
  })
  .service('domainSearchMembersProvider', function() {
    return {};
  });
angular.module('esn.scroll', [])
  .factory('elementScrollService', function() {
    return {};
  });
angular.module('esn.attendee', [])
  .constant('ESN_ATTENDEE_DEFAULT_TEMPLATE_URL', '');
angular.module('esn.user', [])
  .factory('userUtils', function() {
    return {
      displayNameOf: angular.noop
    };
  });

angular.module('esn.file-saver', [])
  .factory('esnFileSaver', function() {
    return {};
  });
angular.module('esn.module-registry', [])
  .factory('esnModuleRegistry', function() {
    return {};
  });
angular.module('esn.feature-registry', [])
  .factory('esnFeatureRegistry', function() {
    return {};
  });
angular.module('esn.i18n', [])
  .filter('esnI18n', function() {
    return function(input) { return input; };
  })
  .factory('esnI18nService', function() {
    return {
      translate: function() {}
    };
  });
angular.module('esn.datetime', [])
  .filter('esnDatetime', function() {
    return function(input) { return input; };
  });

angular.module('esn.configuration', [])
  .factory('esnConfigApi', function() {
    return {};
  });
angular.module('linagora.esn.james', [])
  .factory('jamesClientProvider', function() {
    return {};
  });
