'use strict';

angular.module('linagora.esn.admin')

.factory('adminConfigApi', function($q, adminRestangular, ADMIN_MODE, esnConfigApi) {
  function get(domainId, configsToGet) {
    if (domainId !== ADMIN_MODE.platform) {
      return esnConfigApi.getDomainConfigurations(domainId, configsToGet);
    }

    return esnConfigApi.getPlatformConfigurations(configsToGet);
  }

  function set(domainId, configsToSet) {
    if (domainId !== ADMIN_MODE.platform) {
      return esnConfigApi.setDomainConfigurations(domainId, configsToSet);
    }

    return esnConfigApi.setPlatformConfigurations(configsToSet);
  }

  function generateJwtKeyPair() {
    return adminRestangular
      .all('configuration')
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
