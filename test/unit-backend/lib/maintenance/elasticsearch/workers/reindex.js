const { expect } = require('chai');
const sinon = require('sinon');

describe('The reindex worker', function() {
  let getModule;
  let deps, jobQueueMock, elasticsearchMock;

  beforeEach(function() {
    const dependencies = name => deps[name];

    getModule = () => require(`${this.moduleHelpers.modulesPath}/backend/lib/maintenance/elasticsearch/workers/reindex`)(dependencies);

    jobQueueMock = {};
    elasticsearchMock = {
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

  it('should return the correct job name', function() {
    const constants = require(`${this.moduleHelpers.modulesPath}/backend/lib/maintenance/elasticsearch/constants`);

    expect(getModule().name).to.equal(constants.JOBQUEUE_WORKER_NAMES.REINDEX);
  });

  describe('The handle method', function() {
    let getHandleMethod;

    beforeEach(function() {
      getHandleMethod = () => getModule().handler.handle;
    });

    it('should reject if there is no corresponding index for resource type', function(done) {
      const type = 'foo';

      elasticsearchMock.reindexRegistry.getAll = sinon.stub().returns([]);

      getHandleMethod()({ data: { type } })
        .then(() => done('Should not resolve'))
        .catch(err => {
          expect(elasticsearchMock.reindexRegistry.getAll).to.have.been.calledOnce;
          expect(err.message).to.equal(`There is no corresponding index for: ${type}`);
          done();
        });
    });

    it('should reject if failed to build reindexing options', function(done) {
      const type = 'foo';
      const buildReindexOptionsFunctionMock = sinon.stub().returns(Promise.reject(new Error('something wrong')));
      const registers = {};

      registers[type] = {
        buildReindexOptionsFunction: buildReindexOptionsFunctionMock
      };

      elasticsearchMock.reindexRegistry.getAll = () => registers;
      elasticsearchMock.reindex = sinon.spy();

      getHandleMethod()({ data: { type } })
        .then(() => done('Should not resolve'))
        .catch(err => {
          expect(buildReindexOptionsFunctionMock).to.have.been.calledOnce;
          expect(elasticsearchMock.reindex).to.not.have.been.called;
          expect(err.message).to.equal('something wrong');
          done();
        });
    });

    it('should reject if failed to reindex', function(done) {
      const type = 'foo';
      const registers = {};
      const options = { bar: 'baz' };

      registers[type] = {
        buildReindexOptionsFunction: () => Promise.resolve(options)
      };

      elasticsearchMock.reindexRegistry.getAll = () => registers;
      elasticsearchMock.reindex = sinon.stub().returns(Promise.reject(new Error('something wrong')));

      getHandleMethod()({ data: { type } })
        .then(() => done('Should not resolve'))
        .catch(err => {
          expect(elasticsearchMock.reindex).to.have.been.calledWith(options);
          expect(err.message).to.equal('something wrong');
          done();
        });
    });

    it('should resolve if success to reindex', function(done) {
      const type = 'foo';
      const registers = {};
      const options = { bar: 'baz' };

      registers[type] = {
        buildReindexOptionsFunction: () => Promise.resolve(options)
      };

      elasticsearchMock.reindexRegistry.getAll = () => registers;
      elasticsearchMock.reindex = sinon.stub().returns(Promise.resolve());

      getHandleMethod()({ data: { type } })
        .then(() => {
          expect(elasticsearchMock.reindex).to.have.been.calledWith(options);
          done();
        })
        .catch(err => done(err || 'should resolve'));
    });
  });

  describe('The title builder method', function() {
    it('should build the correct job title', function() {
      const type = 'foo';

      expect(getModule().handler.getTitle({ type })).to.equal(`Reindex ElasticSearch data for ${type}`);
    });
  });
});
