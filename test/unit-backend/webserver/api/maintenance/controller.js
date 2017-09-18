'use strict';

const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');

describe('The maintenance API getController()', function() {
  let getController, maintainEsMock;

  beforeEach(function() {
    maintainEsMock = {};
    mockery.registerMock('../../../lib/maintenance/elasticsearch', () => maintainEsMock);
    getController = () => require(this.moduleHelpers.modulesPath + '/backend/webserver/api/maintenance/controller')(this.moduleHelpers.dependencies);
  });

  describe('The maintainElasticsearch fn', function() {
    it('should respond 202 on success', function(done) {
      maintainEsMock.reindexUsers = sinon.spy();
      maintainEsMock.reconfigUsers = sinon.spy();

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
              expect(maintainEsMock.reindexUsers).to.have.been.calledWith();
              expect(maintainEsMock.reconfigUsers).to.not.have.been.calledWith();
              done();
            }
          };
        }
      };

      getController().maintainElasticsearch(req, res);
    });

    it('should respond 202 on success (reconfigure)', function(done) {
      maintainEsMock.reindexUsers = sinon.spy();
      maintainEsMock.reconfigUsers = sinon.spy();

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
              expect(maintainEsMock.reindexUsers).to.not.have.been.calledWith();
              expect(maintainEsMock.reconfigUsers).to.have.been.calledWith();
              done();
            }
          };
        }
      };

      getController().maintainElasticsearch(req, res);
    });

    it('should respond 400 if the resource type is not supported', function(done) {
      const req = {
        query: {
          action: 'foo',
          resource_type: 'bar'
        }
      };
      const res = {
        status(code) {
          expect(code).to.equal(400);

          return {
            json(json) {
              expect(json).to.deep.equal({
                error: {
                  code: 400,
                  message: 'Bad Request',
                  details: 'Unsupported action foo and resource_type bar'
                }
              });
              done();
            }
          };
        }
      };

      getController().maintainElasticsearch(req, res);
    });

    it('should respond 400 if the action is not supported', function(done) {
      const req = {
        query: {
          action: 'foo',
          resource_type: 'users'
        }
      };
      const res = {
        status(code) {
          expect(code).to.equal(400);

          return {
            json(json) {
              expect(json).to.deep.equal({
                error: {
                  code: 400,
                  message: 'Bad Request',
                  details: 'Unsupported action foo and resource_type users'
                }
              });
              done();
            }
          };
        }
      };

      getController().maintainElasticsearch(req, res);
    });
  });
});
