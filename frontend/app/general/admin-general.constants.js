(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .constant('ADMIN_GENERAL_CONFIG', {
      platform: ['login', 'businessHours', 'datetime'],
      domain: ['businessHours', 'datetime']
    });
})(angular);
