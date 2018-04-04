(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .controller('adminModulesDisplayerController', adminModulesDisplayerController);

  function adminModulesDisplayerController(
    $stateParams,
    $scope,
    $timeout,
    $q,
    asyncAction,
    adminDomainConfigService,
    adminModulesService,
    adminModeService,
    ADMIN_MODE,
    ADMIN_FORM_EVENT,
    ADMIN_DEFAULT_NOTIFICATION_MESSAGES
  ) {
    var self = this;
    var domainId = $stateParams.domainId;
    var HOMEPAGE_KEY = 'homePage';
    var timeoutDuration = 500;
    var postSaveHandlers = [];

    self.$onInit = $onInit();
    self.registerPostSaveHandler = registerPostSaveHandler;

    function $onInit() {
      self.mode = adminModeService.getCurrentMode();
      self.availableModes = ADMIN_MODE;
      self.configurations = buildConfigurations(self.module);
    }

    function buildConfigurations(module) {
      if (moduleHasConfigurations(module)) {
        var configurations = {};

        angular.forEach(module.config.configurations, function(config) {
          configurations[config.name] = config;
        });

        return configurations;
      }

      return false;
    }

    function moduleHasConfigurations(module) {
      return module.config && module.config.configurations && module.config.configurations.length > 0;
    }

    self.setHome = function(event) {
      event.stopPropagation();

      if (self.module.homePage !== self.currentHomepage) {
        var currentHomePage = self.currentHomepage;

        self.currentHomepage = self.module.homePage;

        return asyncAction(ADMIN_DEFAULT_NOTIFICATION_MESSAGES, function() {
          return adminDomainConfigService.set(domainId, HOMEPAGE_KEY, self.module.homePage);
        }).catch(function() {
          $timeout(function() {
            self.currentHomepage = currentHomePage;
          }, timeoutDuration);
        });
      }
    };

    self.isHomePage = function() {
      return self.currentHomepage === self.module.homePage;
    };

    self.save = function() {
      return asyncAction(ADMIN_DEFAULT_NOTIFICATION_MESSAGES, function() {
        return adminModulesService.set(domainId, [self.module])
          .then(function() {
            return $q.all(postSaveHandlers.map(function(handler) {
              return handler();
            }));
          })
          .then(function() {
            $scope.$broadcast(ADMIN_FORM_EVENT.submit);
            $scope.form.$setPristine();
          });
      });
    };

    self.reset = function() {
      $scope.$broadcast(ADMIN_FORM_EVENT.reset);
      $scope.form.$setPristine();
    };

    function registerPostSaveHandler(handler) {
      postSaveHandlers.push(handler);
    }
  }
})(angular);
