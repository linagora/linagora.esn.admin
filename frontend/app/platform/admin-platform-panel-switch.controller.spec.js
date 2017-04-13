'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminPlatformPanelSwitch controller', function() {
  var $controller, $rootScope, $scope, $state, session;

    beforeEach(function() {
      module('linagora.esn.admin', function($provide) {
        $state = {
          go: sinon.spy(),
          is: sinon.spy()
        };

        session = {
          domain: {
            _id: '1123123'
          },
          ready: {
            then: function() {
              return $q.when();
            }
          },
          user: {
            isPlatformAdmin: true
          },
          userIsDomainAdministrator: sinon.spy()
        };

        $provide.value('$state', $state);
        $provide.value('session', session);
      });

      inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
      });
    });

    function initController(scope) {
      $scope = scope || $rootScope.$new();

      var controller = $controller('adminPlatformPanelSwitchController', {
        $scope: $scope
      });

      $scope.$digest();

      return controller;
    }

    describe('The isInPlatformPage fn', function() {
      it('should show whether if current state is admin.platform', function() {
        var controller = initController();

        controller.isInPlatformPage();

        expect($state.is).to.have.been.calledWith('admin.platform');
      });
    });

    describe('The transition fn', function() {

      it('should transition to platform page if current page is domain-based', function() {
        var controller = initController();

        $state.is = function() { return false; };
        controller.transition();

        expect($state.go).to.have.been.calledWith('admin.platform');
      });

      it('should transition to domain state if current page is platform-based', function() {
        var controller = initController();

        $state.is = function() { return true; };
        controller.transition();

        expect($state.go).to.have.been.calledWith('admin.domain', {
          domainId: session.domain._id
        });
      });

    });

});
