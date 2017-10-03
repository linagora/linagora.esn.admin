'use strict';

module.exports = function(dependencies) {
  const jobQueue = dependencies('jobqueue');
  const logger = dependencies('logger');
  const elasticsearch = dependencies('elasticsearch');
  const coreUser = dependencies('user');
  const ES_REINDEX_WORKER_NAME = 'elasticsearch-reindex';
  const ES_RECONFIG_WORKER_NAME = 'elasticsearch-reconfig';
  const INDEX_MAPPING = {
    users: 'users.idx'
  };

  return {
    init,
    reindexUsers,
    reconfigUsers
  };

  function init() {
    registerReindexWorker();
    registerReconfigWorker();
  }

  function reindexUsers() {
    const userCursor = coreUser.listByCursor();
    const options = {
      type: 'users',
      index: 'users.idx',
      name: 'users.idx',
      next() { return userCursor.next(); },
      denormalize: coreUser.denormalize.denormalizeForSearchIndexing,
      getId: coreUser.denormalize.getId
    };

    return submitReindexJob(options);
  }

  function reconfigUsers() {
    return submitReconfigJob('users');
  }

  function submitReindexJob(options) {
    const workerName = ES_REINDEX_WORKER_NAME;
    const jobName = getJobName(workerName, options.type);

    logger.debug(`Submitting ElasticSearch reindex job: ${jobName}`);

    return jobQueue.lib.submitJob(workerName, jobName, options);
  }

  function submitReconfigJob(type) {
    if (!INDEX_MAPPING[type]) {
      return Promise.reject(new Error(`There is no corresponding index for: ${type}`));
    }

    const workerName = ES_RECONFIG_WORKER_NAME;
    const jobName = getJobName(workerName, type);

    logger.debug(`Submitting ElasticSearch index-reconfigure job: ${jobName}`);

    return jobQueue.lib.submitJob(workerName, jobName, { name: INDEX_MAPPING[type], type: type });
  }

  function registerReindexWorker() {
    logger.debug('Registering ElasticSearch reindex worker');

    return jobQueue.lib.workers.add({
      name: ES_REINDEX_WORKER_NAME,
      getWorkerFunction() {
        return data => elasticsearch.reindex(data);
      }
    });
  }

  function registerReconfigWorker() {
    logger.debug('Registering ElasticSearch reconfig worker');

    return jobQueue.lib.workers.add({
      name: ES_RECONFIG_WORKER_NAME,
      getWorkerFunction() {
        return data => elasticsearch.reconfig(data.name, data.type);
      }
    });
  }

  function getJobName(worker, type) {
    return `${worker}-${type}-${Date.now()}`;
  }
};
