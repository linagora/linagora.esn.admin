'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminMailResolverController', function() {
  var $controller, $rootScope, $scope;
  var resolver;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    });

    resolver = {
      name: 'abc',
      options: {
        key1: 'value1',
        key2: 'value2'
      }
    };
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminMailResolverController', { $scope: $scope }, { resolver: resolver });

    $scope.$digest();

    return controller;
  }

  it('should get an array options when init controller', function() {
    var controller = initController();
    expect(controller.options).to.deep.equal([{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]);
  });

  describe('The addOption fn', function() {
    it('should push empty object to options array', function() {
      var controller = initController();
      var expectOptions = [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }, {}];

      controller.addOption();
      expect(controller.options).to.deep.equal(expectOptions);
    });
  });

  describe('The deleteOption fn', function() {
    it('should delete object from options array', function() {
      var controller = initController();
      var expectOptions = [{ key: 'key2', value: 'value2' }];
      var $index = 0;

      controller.deleteOption($index);

      expect(controller.options).to.deep.equal(expectOptions);
    });
  });

  describe('The qualifyResolver fn', function() {
    it('should qualify resolver.options object from options array', function() {
      var controller = initController();
      controller.options = [{ key: 'key', value: 'value' }];

      controller.qualifyResolver();

      expect(controller.resolver.options).to.deep.equal({key: 'value'});
    });
  });
});
