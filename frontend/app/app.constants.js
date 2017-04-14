'use strict';

angular.module('linagora.esn.admin')

.constant('ADMIN_MODE', {
  domain: 'domain',
  platform: 'platform'
})

.constant('ADMIN_PAGES', [{
  id: 'mail',
  name: 'Mail',
  icon: 'mdi-email',
  displayIn: {
    domain: true,
    platform: true
  }
}, {
  id: 'users',
  name: 'Users',
  icon: 'mdi-account-multiple',
  displayIn: {
    domain: true,
    platform: false
  }
}, {
  id: 'roles',
  name: 'Roles',
  icon: 'mdi-clipboard-account',
  displayIn: {
    domain: true,
    platform: false
  }
}, {
  id: 'dav',
  name: 'DAV',
  icon: 'mdi-calendar-blank',
  displayIn: {
    domain: true,
    platform: false
  }
}, {
  id: 'ldap',
  name: 'LDAP',
  icon: 'mdi-book',
  displayIn: {
    domain: true,
    platform: false
  }
}, {
  id: 'web',
  name: 'Web',
  icon: 'mdi-web',
  displayIn: {
    domain: true,
    platform: false
  }
}, {
  id: 'modules',
  name: 'Modules',
  icon: 'mdi-view-module',
  displayIn: {
    domain: true,
    platform: false
  }
}, {
  id: 'james',
  name: 'James',
  icon: 'mdi-fire',
  displayIn: {
    domain: true,
    platform: false
  }
}]);
