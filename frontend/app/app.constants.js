'use strict';

angular.module('linagora.esn.admin')

.constant('ADMIN_MODE', {
  domain: 'domain',
  platform: 'platform'
})

.constant('ADMIN_DEFAULT_NOTIFICATION_MESSAGES', {
  progressing: 'Saving configuration...',
  success: 'Configuration saved',
  failure: 'Failed to save configuration'
})

.constant('ADMIN_PAGES', [{
  id: 'general',
  name: 'General',
  icon: 'mdi-settings',
  displayIn: {
    domain: true,
    platform: true
  }
}, {
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
    platform: true
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
}, {
  id: 'jwt',
  name: 'JWT',
  icon: 'mdi-shield',
  displayIn: {
    domain: false,
    platform: true
  }
}, {
  id: 'oauth',
  name: 'Social connections',
  icon: 'mdi-twitter',
  displayIn: {
    domain: false,
    platform: true
  }
}, {
  id: 'autoconf',
  name: 'Autoconf',
  icon: 'mdi-layers',
  displayIn: {
    domain: true,
    platform: false
  }
}, {
  id: 'domains',
  name: 'Domains',
  icon: 'mdi-view-list',
  displayIn: {
    domain: false,
    platform: true
  }
}]);
