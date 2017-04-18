'use strict';

angular.module('linagora.esn.admin')

.factory('adminConfigApi', function($q, Restangular, adminRestangular, ADMIN_MODE) {
  function get(domainId, query) {
    var request = adminRestangular.all('configuration');

    if (domainId !== ADMIN_MODE.platform) {
      request = request.one('domains', domainId);
    }

    return request
      .customPOST(query)
      .then(function(response) {
        if (response.status !== 200) {
          return $q.reject(response);
        }

        return Restangular.stripRestangular(response.data);
      });
  }

  function set(domainId, query) {
    var request = adminRestangular.all('configuration');

    if (domainId !== ADMIN_MODE.platform) {
      request = request.one('domains', domainId);
    }

    return request.customPUT(query);
  }

  function generateJwtKeyPair(domainId) {
    return adminRestangular
      .all('configuration')
      .one('domains', domainId)
      .one('generateJwtKeyPair')
      .post();
  }

  function generateJwtToken(domainId) {
    return adminRestangular
      .all('configuration')
      .one('domains', domainId)
      .one('generateJwtToken')
      .post();
  }

  return {
    get: get,
    set: set,
    generateJwtKeyPair: generateJwtKeyPair,
    generateJwtToken: generateJwtToken
  };
});
