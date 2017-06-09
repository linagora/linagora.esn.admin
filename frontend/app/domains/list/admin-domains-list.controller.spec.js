'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminDomainsListController', function() {

  var $rootScope, $compile;
  var infiniteScrollHelperMock;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();

    angular.mock.module(function($provide) {
      $provide.value('infiniteScrollHelper', infiniteScrollHelperMock);
    });
  });

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin');

    inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    });

  });

  function initComponent(scope) {
    scope = scope || $rootScope.$new();
    var html = '<admin-domains-list />';
    var element = $compile(html)(scope);

    scope.$digest();

    return element;
  }

  it('should call infiniteScrollHelper to load elements', function() {
    initComponent();

    expect(infiniteScrollHelperMock).to.have.been.called;
  });
});
