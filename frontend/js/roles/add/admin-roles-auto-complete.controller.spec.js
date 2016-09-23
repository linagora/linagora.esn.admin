'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminRolesAutoCompleteController', function() {
  var $controller, $rootScope, $scope, $elementMock;
  var elementScrollService, adminRolesService;

  beforeEach(function() {
    module('linagora.esn.admin');

    $elementMock = {
      find: function() {}
    };

    module(function($provide) {
      $provide.value('$element', $elementMock);
    });

    inject(function(_$controller_, _$rootScope_, _elementScrollService_, _adminRolesService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      elementScrollService = _elementScrollService_;
      adminRolesService = _adminRolesService_;
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminRolesAutoCompleteController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  describe('The onTagAdding fn', function() {
    var newAdministrators;

    beforeEach(function() {
      newAdministrators = [{id: 'user1', name: 'user1'}];
    });

    it('should not add new tag if it already have been existed in array of newAdministrators', function() {
      var controller = initController();
      var $tag = newAdministrators[0];

      controller.newAdministrators = newAdministrators;
      controller.onTagAdding($tag);

      expect(controller.newAdministrators).to.deep.equal(newAdministrators);
    });

    it('should add new tag if it is not exist in array of newAdministrators', function() {
      var controller = initController();
      var $tag = {id: 'user2', name: 'user2'};

      controller.newAdministrators = newAdministrators;
      newAdministrators.push($tag);

      controller.onTagAdding($tag);

      expect(controller.newAdministrators).to.deep.equal(newAdministrators);
    });
  });

  describe('The onTagAdded fn', function() {
    it('should call elementScrollService.autoScrollDown', function() {
      elementScrollService.autoScrollDown = sinon.spy();

      var controller = initController();

      controller.onTagAdded();

      expect(elementScrollService.autoScrollDown).to.have.been.calledOnce;
    });
  });
});
