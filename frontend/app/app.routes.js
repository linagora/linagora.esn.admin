'use strict';

angular.module('linagora.esn.admin')

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/admin', function($state, $location, session, adminModeService) {
    session.ready.then(function() {
      if (session.userIsDomainAdministrator()) {
        return adminModeService.goToDomainMode();
      }

      if (session.user.isPlatformAdmin) {
        return adminModeService.goToPlatformMode();
      }

      return $location.path('/');
    });
  });

  $stateProvider
    .state('admin', {
      url: '/admin',
      templateUrl: '/admin/app/app.html',
      resolve: {
        isAdmin: function($location, session) {
          return session.ready.then(function() {
            if (!session.userIsDomainAdministrator() && !session.user.isPlatformAdmin) { $location.path('/'); }
          });
        }
      }
    })
    .state('admin.domain', {
      url: '/:domainId',
      deepStateRedirect: {
        default: 'admin.domain.general',
        params: true,
        fn: function() {
          return true;
        }
      },
      resolve: {
        isAdmin: function($location, session) {
          return session.ready.then(function() {
            if (!session.userIsDomainAdministrator() && !session.user.isPlatformAdmin) { $location.path('/'); }
          });
        }
      }
    })
    .state('admin.domain.mail', {
      url: '/mail',
      views: {
        'root@admin': {
          template: '<admin-mail />'
        }
      }
    })
    .state('admin.domain.users', {
      url: '/users',
      views: {
        'root@admin': {
          template: '<admin-users />'
        }
      }
    })
    .state('admin.domain.users.create', {
      url: '/create',
      views: {
        'root@admin': {
          template: '<admin-users-create />'
        }
      },
      params: { user: null }
    })
    .state('admin.domain.dav', {
      url: '/dav',
      views: {
        'root@admin': {
          template: '<admin-dav />'
        }
      }
    })
    .state('admin.domain.ldap', {
      url: '/ldap',
      views: {
        'root@admin': {
          template: '<admin-ldap />'
        }
      }
    })
    .state('admin.domain.modules', {
      url: '/modules',
      views: {
        'root@admin': {
          template: '<admin-modules />'
        }
      }
    })
    .state('admin.domain.roles', {
      url: '/roles',
      views: {
        'root@admin': {
          template: '<admin-roles />'
        }
      }
    })
    .state('admin.domain.web', {
      url: '/web',
      views: {
        'root@admin': {
          template: '<admin-web />'
        }
      }
    })
    .state('admin.domain.james', {
      url: '/james',
      views: {
        'root@admin': {
          template: '<admin-james />'
        }
      }
    })
    .state('admin.domain.jwt', {
      url: '/jwt',
      views: {
        'root@admin': {
          template: '<admin-jwt />'
        }
      }
    })
    .state('admin.domain.general', {
      url: '/general',
      views: {
        'root@admin': {
          template: '<admin-general />'
        }
      }
    })
    .state('admin.domain.oauth', {
      url: '/oauth',
      views: {
        'root@admin': {
          template: '<admin-oauth />'
        }
      }
    })
    .state('admin.domain.autoconf', {
      url: '/autoconf',
      views: {
        'root@admin': {
          template: '<admin-autoconf />'
        }
      }
    })
    .state('admin.domain.domains', {
      url: '/domains',
      views: {
        'root@admin': {
          template: '<admin-domains />'
        }
      }
    })
    .state('admin.domain.features', {
      url: '/features',
      views: {
        'root@admin': {
          template: '<admin-features />'
        }
      }
    });
});
