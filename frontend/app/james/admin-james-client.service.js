(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .factory('james', function($window) {
    return $window.james;
  })

  .factory('adminJamesClientTransport', function($http) {
    return {
      get: function(url, headers) {
        return $http.get(url, {headers: headers}).then(function(response) {
          return response.data;
        });
      },
      put: function(url, headers, data) {
        return $http.put(url, data, {headers: headers}).then(function(response) {
          return response.data;
        });
      }
    };
  })

  .factory('adminJamesClientProvider', function(adminConfigApi, james, adminJamesClientTransport) {
    var cachedPromises = {};

    function get(domainId, apiUrl) {
      if (!cachedPromises[domainId]) {
        cachedPromises[domainId] = adminConfigApi.generateJwtToken(domainId);
      }

      return cachedPromises[domainId].then(function(resp) {
        var token = resp.data;
        var options = {
          httpClient: adminJamesClientTransport,
          promiseProvider: null,
          apiUrl: apiUrl,
          token: token
        };

        return new james.Client(options);
      });
    }

    return {
      get: get
    };
  });
})(angular);
