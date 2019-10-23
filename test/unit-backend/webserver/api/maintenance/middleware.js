const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');

describe('The maintenance middleware', function() {
  let getModule;

  beforeEach(function() {
    getModule = () => require(`${this.moduleHelpers.modulesPath}/backend/webserver/api/maintenance/middleware`)(this.moduleHelpers.dependencies);
    mockery.registerMock('../../../lib/maintenance/elasticsearch', () => ({ getRegisteredResourceTypes: () => {} }));
  });

  describe('The validateMaintenanceAction function', function() {
    let constantsMock;

    beforeEach(function() {
      constantsMock = {};
    });

    it('should respond 400 if there is a unsupported action', function(done) {
      const action = 'bar';

      constantsMock.ACTIONS = {
        foo: () => {}
      };
      mockery.registerMock('./constants', () => constantsMock);

      const req = {
        query: {
          action
        }
      };
      const res = {
        status: code => {
          expect(code).to.equal(400);

          return {
            json: response => {
              expect(response).to.deep.equal({
                error: {
                  code: 400,
                  message: 'Bad Request',
                  details: `Unsupported action ${action}`
                }
              });
              done();
            }
          };
        }
      };
      const next = () => {};

      getModule().validateMaintenanceAction(req, res, next);
    });

    it('should call #next() function if there is a supported action', function(done) {
      constantsMock.ACTIONS = {
        foo: () => {}
      };
      mockery.registerMock('./constants', () => constantsMock);

      const req = {
        query: {
          action: 'foo'
        }
      };
      const res = {};
      const next = () => done();

      getModule().validateMaintenanceAction(req, res, next);
    });
  });

  describe('The validateMaintenanceResourceType function', function() {
    let maintainEsMock;

    beforeEach(function() {
      maintainEsMock = {};
      mockery.registerMock('../../../lib/maintenance/elasticsearch', () => maintainEsMock);
    });

    it('should respond 400 if there is a unsupported resource type', function(done) {
      const resource_type = 'bar';

      maintainEsMock = {
        getRegisteredResourceTypes: sinon.stub().returns(['foo'])
      };
      mockery.registerMock('../../../lib/maintenance/elasticsearch', () => maintainEsMock);

      const req = {
        query: {
          resource_type
        }
      };
      const res = {
        status: code => {
          expect(code).to.equal(400);

          return {
            json: response => {
              expect(response).to.deep.equal({
                error: {
                  code: 400,
                  message: 'Bad Request',
                  details: `Unsupported resource_type ${resource_type}`
                }
              });
              done();
            }
          };
        }
      };
      const next = () => {};

      getModule().validateMaintenanceResourceType(req, res, next);
    });

    it('should call #next() function if requested type is "all"', function(done) {
      maintainEsMock = {
        getRegisteredResourceTypes: sinon.stub().returns([])
      };
      mockery.registerMock('../../../lib/maintenance/elasticsearch', () => maintainEsMock);

      const req = {
        query: {
          resource_type: 'all'
        }
      };
      const res = {};
      const next = () => done();

      getModule().validateMaintenanceResourceType(req, res, next);
    });

    it('should call #next() function if there is a supported resource type', function(done) {
      const resource_type = 'bar';

      maintainEsMock = {
        getRegisteredResourceTypes: sinon.stub().returns([resource_type])
      };
      mockery.registerMock('../../../lib/maintenance/elasticsearch', () => maintainEsMock);

      const req = {
        query: {
          resource_type
        }
      };
      const res = {};
      const next = () => done();

      getModule().validateMaintenanceResourceType(req, res, next);
    });
  });
});
