'use strict';

angular.module('linagora.esn.admin')

.factory('adminConfigApi', function(adminRestangular) {
  function get(domainId, query) {
    return adminRestangular
      .all('configuration')
      .one('domain', domainId)
      .customPOST(query)
      .then(function(response) {
        if (response.status !== 200) {
          return $q.reject(response);
        }

        return response.data;
      });
  }

  function set(domainId, query) {
    return adminRestangular
      .all('configuration')
      .one('domain', domainId)
      .customPUT(query);
  }

  return {
    get: get,
    set: set
  };
});
