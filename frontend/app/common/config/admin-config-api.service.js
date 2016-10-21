'use strict';

angular.module('linagora.esn.admin')

.factory('adminConfigApi', function($q, Restangular, adminRestangular) {
  function get(domainId, query) {
    return adminRestangular
      .all('configuration')
      .one('domains', domainId)
      .customPOST(query)
      .then(function(response) {
        if (response.status !== 200) {
          return $q.reject(response);
        }

        return Restangular.stripRestangular(response.data);
      });
  }

  function set(domainId, query) {
    return adminRestangular
      .all('configuration')
      .one('domains', domainId)
      .customPUT(query);
  }

  return {
    get: get,
    set: set
  };
});
