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
    it('should submit reindex job with the correct params', function(done) {
      const type = 'foo';

      jobQueueMock.lib = {
        submitJob: sinon.stub().returns(Promise.resolve())
      };

      getModule().reindex(type)
        .then(() => {
          expect(jobQueueMock.lib.submitJob).to.have.been.calledWith(constants.JOBQUEUE_WORKER_NAMES.REINDEX, { type });
          done();
        })
        .catch(err => done(err || new Error('Should resolve')));
    });

    it('should submit reindex jobs for all registered resource types if the requested type is "all"', function(done) {
      const registeredTypes = { foo: {}, bar: {} };
      const getAllMock = sinon.stub().returns(registeredTypes);

      deps.elasticsearch = {
        reindexRegistry: {
          getAll: getAllMock
        }
      };

      jobQueueMock.lib = {
        submitJob: sinon.stub().returns(Promise.resolve())
      };

      getModule().reindex(constants.TYPE_FOR_ALL_RESOURCES)
        .then(() => {
          expect(jobQueueMock.lib.submitJob).to.have.been.calledTwice;
          expect(jobQueueMock.lib.submitJob).to.have.been.calledWith(constants.JOBQUEUE_WORKER_NAMES.REINDEX, { type: 'foo' });
          expect(jobQueueMock.lib.submitJob).to.have.been.calledWith(constants.JOBQUEUE_WORKER_NAMES.REINDEX, { type: 'bar' });

          expect(getAllMock).to.have.been.calledOnce;
          done();
        })
        .catch(err => done(err || new Error('Should resolve')));
    });
  });

  describe('The reconfigure method', function() {
    it('should submit reconfigure job with the correct params', function(done) {
      const type = 'foo';

      jobQueueMock.lib = {
        submitJob: sinon.stub().returns(Promise.resolve())
      };

      getModule().reconfigure(type)
        .then(() => {
          expect(jobQueueMock.lib.submitJob).to.have.been.calledWith(constants.JOBQUEUE_WORKER_NAMES.RECONFIG, { type });
          done();
        })
        .catch(err => done(err || new Error('Should resolve')));
    });

    it('should submit reconfigure jobs for all registered resource types if the requested type is "all"', function(done) {
      const registeredTypes = { foo: {}, bar: {} };
      const getAllMock = sinon.stub().returns(registeredTypes);

      deps.elasticsearch = {
        reindexRegistry: {
          getAll: getAllMock
        }
      };

      jobQueueMock.lib = {
        submitJob: sinon.stub().returns(Promise.resolve())
      };

      getModule().reconfigure(constants.TYPE_FOR_ALL_RESOURCES)
        .then(() => {
          expect(jobQueueMock.lib.submitJob).to.have.been.calledTwice;
          expect(jobQueueMock.lib.submitJob).to.have.been.calledWith(constants.JOBQUEUE_WORKER_NAMES.RECONFIG, { type: 'foo' });
          expect(jobQueueMock.lib.submitJob).to.have.been.calledWith(constants.JOBQUEUE_WORKER_NAMES.RECONFIG, { type: 'bar' });

          expect(getAllMock).to.have.been.calledOnce;
          done();
        })
        .catch(err => done(err || new Error('Should resolve')));
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
