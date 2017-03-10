(function() {
  'use strict';

  angular.module('linagora.esn.admin')

  .factory('james', function($window) {
    return $window.james;
  })

  .factory('httpTransport', function($http) {
    return {
      get: function(url, headers) {
        return $http.get(url, {headers: headers}).then(function(response) {
          return response.data;
        });
      }
    };
  })

  .factory('adminJamesClientProvider', function($q, adminConfigApi, adminDomainConfigService, james, httpTransport) {
    var cachedPromises = {};

    function get(domainId) {
      if (!cachedPromises[domainId]) {
        cachedPromises[domainId] = $q.all([
          adminDomainConfigService.get(domainId, 'james'),
          adminConfigApi.generateJwtToken(domainId)
        ]).then(function(data) {
            var options = {
              httpClient: httpTransport,
              promiseProvider: null,
              apiUrl: data[0].url,
              token: data[1]
            };

            return new james.Client(options);
          });
      }

      return cachedPromises[domainId];
    }

    return {
      get: get
    };
  });
})();
