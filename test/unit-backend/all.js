'use strict';

var mockery = require('mockery');
var chai = require('chai');
var path = require('path');

before(function() {
  chai.use(require('chai-shallow-deep-equal'));
  chai.use(require('sinon-chai'));
  chai.use(require('chai-as-promised'));
  this.helpers = {};
});

beforeEach(function() {
  mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
  var depsStore = {
    logger: require('./fixtures/logger-noop'),
    errors: require('./fixtures/errors')
  };
  var dependencies = function(name) {
    return depsStore[name];
  };
  var addDep = function(name, dep) {
    depsStore[name] = dep;
  };

  this.moduleHelpers = {
    modulesPath: path.resolve(__dirname + '/../../'),
    addDep: addDep,
    dependencies: dependencies
  };
});

afterEach(function() {
  mockery.resetCache();
  mockery.deregisterAll();
  mockery.disable();
});
