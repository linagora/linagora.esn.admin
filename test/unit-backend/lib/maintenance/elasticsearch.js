const expect = require('chai').expect;
const sinon = require('sinon');

describe('The lib/maintenance/elasticsearch module', function() {
  let deps, jobQueueMock, elasticsearchMock;

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
      reconfig: function() {},
      reindexRegistry: {
        getAll: () => ({})
      }
    };

    deps = {
      logger: {
        debug: function() {},
        info: function() {},
        error: function() {}
      },
      jobqueue: jobQueueMock,
      elasticsearch: elasticsearchMock
    };
  });

  describe('The init function', function() {
    it('should register reindex worker and reconfigure worker', function() {
      jobQueueMock.lib.workers.add = sinon.spy();

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
    });
  });

  describe('The reindex function', function() {
    it('should reject if there is a unsupported type', function(done) {
      const type = 'foo';

      elasticsearchMock.reindexRegistry.getAll = sinon.stub().returns([]);

      getModule().reindex(type)
        .catch((err) => {
          expect(err.message).to.equal(`There is no corresponding index for: ${type}`);
          expect(elasticsearchMock.reindexRegistry.getAll).to.have.been.calledOnce;
          done();
        });
    });

    it('should submit a reindex job', function(done) {
      const reindexOptions = {
        type: 'foo',
        index: 'foo.idx',
        name: 'foo.idx',
        denormalize: () => {},
        getId: () => {}
      };
      const buildReindexOptionsFunctionMock = sinon.stub().returns(Promise.resolve(reindexOptions));

      elasticsearchMock.reindexRegistry.getAll = sinon.stub().returns({
        [reindexOptions.type]: {
          name: reindexOptions.name,
          buildReindexOptionsFunction: buildReindexOptionsFunctionMock
        }
      });

      jobQueueMock.lib.submitJob = sinon.spy((workerName, jobName, options) => {
        expect(workerName).to.equal('elasticsearch-reindex');
        expect(options).to.shallowDeepEqual(reindexOptions);
      });

      getModule().reindex(reindexOptions.type)
        .then(() => {
          expect(elasticsearchMock.reindexRegistry.getAll).to.have.been.calledOnce;
          expect(buildReindexOptionsFunctionMock).to.have.been.calledOnce;
          expect(jobQueueMock.lib.submitJob).to.have.been.calledOnce;
          done();
        })
        .catch(err => done(err || 'should resolve'));
    });
  });

  describe('The reconfigUsers function', function() {
    it('should reject if there is a unsupported type', function(done) {
      const type = 'foo';

      elasticsearchMock.reindexRegistry.getAll = sinon.stub().returns([]);

      getModule().reconfigure(type)
        .catch((err) => {
          expect(err.message).to.equal(`There is no corresponding index for: ${type}`);
          expect(elasticsearchMock.reindexRegistry.getAll).to.have.been.calledOnce;
          done();
        });
    });

    it('should submit a reconfig job on users index', function(done) {
      const options = {
        type: 'foo',
        name: 'foo.idx'
      };

      elasticsearchMock.reindexRegistry.getAll = sinon.stub().returns({
        [options.type]: {
          name: options.name
        }
      });

      jobQueueMock.lib.submitJob = sinon.spy((workerName, jobName, data) => {
        expect(workerName).to.equal('elasticsearch-reconfig');
        expect(data).to.to.deep.equal({ name: options.name, type: options.type });

        return Promise.resolve();
      });

      getModule().reconfigure(options.type)
        .then(() => {
          expect(elasticsearchMock.reindexRegistry.getAll).to.have.been.calledOnce;
          expect(jobQueueMock.lib.submitJob).to.have.been.calledOnce;
          done();
        })
        .catch(err => done(err || 'should resolve'));
    });
  });
});
