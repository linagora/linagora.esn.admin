'use strict';

const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');

describe('The maintenance API getController()', function() {
  let getController;
  let maintainEsMock;

  beforeEach(function() {
    maintainEsMock = {};
    mockery.registerMock('../../../lib/maintenance/elasticsearch', () => maintainEsMock);
    getController = () => require(this.moduleHelpers.modulesPath + '/backend/webserver/api/maintenance/controller')(this.moduleHelpers.dependencies);
  });

  describe('The maintainElasticsearch fn', function() {
    let constantsMock;

    beforeEach(function() {
      constantsMock = {};
    });

    it('should respond 202 on success', function(done) {
      constantsMock.ACTIONS = {
        reindex: sinon.stub().returns(Promise.resolve()),
        reconfigure: sinon.spy()
      };
      mockery.registerMock('./constants', () => constantsMock);

      const req = {
        query: {
          action: 'reindex',
          resource_type: 'users'
        }
      };
      const res = {
        status(code) {
          expect(code).to.equal(202);

          return {
            end() {
              expect(constantsMock.ACTIONS.reindex).to.have.been.calledOnce;
              expect(constantsMock.ACTIONS.reconfigure).to.not.have.been.called;
              done();
            }
          };
        }
      };

      getController().maintainElasticsearch(req, res);
    });

    it('should respond 202 on success (reconfigure)', function(done) {
      constantsMock.ACTIONS = {
        reindex: sinon.spy(),
        reconfigure: sinon.stub().returns(Promise.resolve())
      };
      mockery.registerMock('./constants', () => constantsMock);

      const req = {
        query: {
          action: 'reconfigure',
          resource_type: 'users'
        }
      };
      const res = {
        status(code) {
          expect(code).to.equal(202);

          return {
            end() {
              expect(constantsMock.ACTIONS.reindex).to.not.have.been.called;
              expect(constantsMock.ACTIONS.reconfigure).to.have.been.calledOnce;
              done();
            }
          };
        }
      };

      getController().maintainElasticsearch(req, res);
    });
  });

  describe('The getRegisteredTypes function', function() {
    it('should respond 200 with the list of registered resource types', function(done) {
      const types = ['foo', 'bar'];

      maintainEsMock.getRegisteredResourceTypes = sinon.stub().returns(types);

      const res = {
        status(code) {
          expect(code).to.equal(200);

          return {
            json: (result) => {
              expect(result).to.deep.equal(types);
              expect(maintainEsMock.getRegisteredResourceTypes).to.have.been.calledOnce;
              done();
            }
          };
        }
      };

      getController().getRegisteredTypes({}, res);
    });
  });
});
