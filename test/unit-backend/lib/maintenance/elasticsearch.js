const expect = require('chai').expect;
const sinon = require('sinon');

describe('The lib/maintenance/elasticsearch module', function() {
  let deps, jobQueueMock, elasticsearchMock, coreUserMock;

  const dependencies = name => deps[name];
  const getModule = () => require('../../../../backend/lib/maintenance/elasticsearch')(dependencies);

  beforeEach(function() {

    jobQueueMock = {
      lib: {
        submitJob: function() {},
        workers: {
          add: function() {}
        }
      }
    };

    elasticsearchMock = {
      reindex: function() {},
      reconfig: function() {}
    };

    coreUserMock = {
      listByCursor: function() {},
      denormalize: {
        denormalizeForSearchIndexing: function() {},
        getId: function() {}
      }
    };

    deps = {
      logger: {
        debug: function() {},
        info: function() {},
        error: function() {}
      },
      jobqueue: jobQueueMock,
      elasticsearch: elasticsearchMock,
      user: coreUserMock
    };
  });

  describe('The init fn', function() {
    it('should register reindex worker and reconfigure worker', function() {
      const workerData = {
        type: 'users',
        name: 'users.idx'
      };

      elasticsearchMock.reindex = sinon.spy();
      elasticsearchMock.reconfig = sinon.spy();
      jobQueueMock.lib.workers.add = sinon.spy(function(worker) {
        worker.getWorkerFunction()(workerData);
      });

      getModule().init();

      expect(jobQueueMock.lib.workers.add).to.be.calledTwice;
      expect(jobQueueMock.lib.workers.add).to.have.been.calledWith(sinon.match({
        name: 'elasticsearch-reindex',
        getWorkerFunction: sinon.match.func
      }));

      expect(jobQueueMock.lib.workers.add).to.have.been.calledWith(sinon.match({
        name: 'elasticsearch-reconfig',
        getWorkerFunction: sinon.match.func
      }));

      expect(elasticsearchMock.reindex).to.have.been.calledOnce;
      expect(elasticsearchMock.reindex).to.have.been.calledWith(workerData);

      expect(elasticsearchMock.reconfig).to.have.been.calledOnce;
      expect(elasticsearchMock.reconfig).to.have.been.calledWith(workerData.name, workerData.type);
    });
  });

  describe('The reindexUsers fn', function() {
    it('should submit a reindex job on users index', function(done) {
      jobQueueMock.lib.submitJob = function(workerName, jobName, options) {
        expect(workerName).to.equal('elasticsearch-reindex');
        expect(options).to.shallowDeepEqual({
          type: 'users',
          index: 'users.idx',
          name: 'users.idx',
          denormalize: coreUserMock.denormalize.denormalizeForSearchIndexing,
          getId: coreUserMock.denormalize.getId
        });

        done();
      };

      getModule().reindexUsers();
    });
  });

  describe('The reconfigUsers fn', function() {
    it('should submit a reconfig job on users index', function(done) {
      jobQueueMock.lib.submitJob = function(workerName, jobName, data) {
        expect(workerName).to.equal('elasticsearch-reconfig');
        expect(data).to.deep.equal({ name: 'users.idx', type: 'users' });

        done();
      };

      getModule().reconfigUsers();
    });
  });
});
