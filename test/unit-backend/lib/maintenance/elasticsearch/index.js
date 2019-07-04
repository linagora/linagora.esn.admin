const { expect } = require('chai');
const sinon = require('sinon');
const mokery = require('mockery');

describe('The The lib/maintenance/elasticsearch module', function() {
  let getModule, jobQueueMock, deps, constants;

  beforeEach(function() {
    const dependencies = name => deps[name];

    getModule = () => require(`${this.moduleHelpers.modulesPath}/backend/lib/maintenance/elasticsearch`)(dependencies);
    constants = require(`${this.moduleHelpers.modulesPath}/backend/lib/maintenance/elasticsearch/constants`);

    jobQueueMock = {};

    deps = {
      logger: {
        debug: function() {},
        info: function() {},
        error: function() {}
      },
      jobqueue: jobQueueMock
    };

  });

  describe('The init method', function() {
    it('should add reindex and reconfig jobs to jobqueue workers', function() {
      const reconfigMock = { foo: 'foo' };
      const reindexMock = { bar: 'bar' };

      jobQueueMock.lib = {
        addWorker: sinon.spy()
      };
      mokery.registerMock('./workers/reconfig', () => reconfigMock);
      mokery.registerMock('./workers/reindex', () => reindexMock);

      getModule().init();

      expect(jobQueueMock.lib.addWorker).to.have.been.calledTwice;
      expect(jobQueueMock.lib.addWorker).to.have.been.calledWith(reconfigMock);
      expect(jobQueueMock.lib.addWorker).to.have.been.calledWith(reindexMock);
    });
  });

  describe('The reindex method', function() {
    it('should submit reindex job with the correct params', function() {
      const type = 'foo';

      jobQueueMock.lib = {
        submitJob: sinon.spy()
      };

      getModule().reindex(type);

      expect(jobQueueMock.lib.submitJob).to.have.been.calledWith(constants.JOBQUEUE_WORKER_NAMES.REINDEX, { type });
    });
  });

  describe('The reconfigure method', function() {
    it('should submit reindex job with the correct params', function() {
      const type = 'foo';

      jobQueueMock.lib = {
        submitJob: sinon.spy()
      };

      getModule().reconfigure(type);

      expect(jobQueueMock.lib.submitJob).to.have.been.calledWith(constants.JOBQUEUE_WORKER_NAMES.RECONFIG, { type });
    });
  });

  describe('The getRegisteredResourceTypes method', function() {
    it('should return the list of registered resource types', function() {
      const registeredTypes = { foo: {}, bar: {} };
      const getAllMock = sinon.stub().returns(registeredTypes);

      deps.elasticsearch = {
        reindexRegistry: {
          getAll: getAllMock
        }
      };

      const types = getModule().getRegisteredResourceTypes();

      expect(types).to.deep.equal(['foo', 'bar']);
      expect(getAllMock).to.have.been.calledOnce;
    });
  });
});
