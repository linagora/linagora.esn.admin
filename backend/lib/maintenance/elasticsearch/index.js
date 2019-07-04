const { REINDEX, RECONFIG } = require('./constants').JOBQUEUE_WORKER_NAMES;

module.exports = dependencies => {
  const jobQueue = dependencies('jobqueue');
  const reconfigWorker = require('./workers/reconfig')(dependencies);
  const reindexWorker = require('./workers/reindex')(dependencies);
  const elasticsearch = dependencies('elasticsearch');

  return {
    getRegisteredResourceTypes,
    init,
    reindex,
    reconfigure
  };

  function init() {
    jobQueue.lib.addWorker(reconfigWorker);
    jobQueue.lib.addWorker(reindexWorker);
  }

  function getRegisteredResourceTypes() {
    const registeredResources = elasticsearch.reindexRegistry.getAll();

    return Object.keys(registeredResources);
  }

  function reindex(resourceType) {
    return jobQueue.lib.submitJob(REINDEX, { type: resourceType });
  }

  function reconfigure(resourceType) {
    return jobQueue.lib.submitJob(RECONFIG, { type: resourceType });
  }
};
