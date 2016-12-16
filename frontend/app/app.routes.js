'use strict';

angular.module('linagora.esn.admin')

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/admin', function($state, $location, session) {
    session.ready.then(function() {
      if (!session.userIsDomainAdministrator()) {
        return $location.path('/');
      }

      var domainId = session.domain._id; // we suppose that an admin manages only 1 domain

      $state.go('admin.domain', { domainId: domainId });
    });
  });

  $stateProvider
    .state('admin', {
      url: '/admin',
      templateUrl: '/admin/app/app',
      resolve: {
        isAdmin: function($location, session) {
          return session.ready.then(function() {
            if (!session.userIsDomainAdministrator()) { $location.path('/'); }
          });
        }
      }
    })
    .state('admin.domain', {
      url: '/:domainId',
      deepStateRedirect: {
        default: 'admin.domain.mail',
        params: true,
        fn: function() {
          return true;
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
    });
});
