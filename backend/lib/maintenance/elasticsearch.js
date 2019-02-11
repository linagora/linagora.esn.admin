module.exports = function(dependencies) {
  const jobQueue = dependencies('jobqueue');
  const logger = dependencies('logger');
  const elasticsearch = dependencies('elasticsearch');
  const ES_REINDEX_WORKER_NAME = 'elasticsearch-reindex';
  const ES_RECONFIG_WORKER_NAME = 'elasticsearch-reconfig';

  return {
    init,
    getRegisteredResourceTypes,
    reindex,
    reconfigure
  };

  function init() {
    registerReindexWorker();
    registerReconfigWorker();
  }

  function getRegisteredResourceTypes() {
    const registeredResources = elasticsearch.reindexRegistry.getAll();

    return Object.keys(registeredResources);
  }

  function reindex(resourceType) {
    const registeredResources = elasticsearch.reindexRegistry.getAll();

    if (!registeredResources[resourceType]) {
      return Promise.reject(new Error(`There is no corresponding index for: ${resourceType}`));
    }

    return registeredResources[resourceType].buildReindexOptionsFunction()
      .then(options => submitReindexJob(options));
  }

  function reconfigure(resourceType) {
    const registeredResources = elasticsearch.reindexRegistry.getAll();

    if (!registeredResources[resourceType]) {
      return Promise.reject(new Error(`There is no corresponding index for: ${resourceType}`));
    }

    return submitReconfigureJob(resourceType, registeredResources[resourceType].name);
  }

  function submitReindexJob(options) {
    const workerName = ES_REINDEX_WORKER_NAME;
    const jobName = getJobName(workerName, options.type);

    logger.debug(`Submitting ElasticSearch reindex job: ${jobName}`);

    return jobQueue.lib.submitJob(workerName, jobName, options);
  }

  function submitReconfigureJob(type, name) {
    const workerName = ES_RECONFIG_WORKER_NAME;
    const jobName = getJobName(workerName, type);

    logger.debug(`Submitting ElasticSearch index-reconfigure job: ${jobName}`);

    return jobQueue.lib.submitJob(workerName, jobName, { name, type });
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
