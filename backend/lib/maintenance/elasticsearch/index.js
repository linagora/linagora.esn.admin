const {
  JOBQUEUE_WORKER_NAMES: { REINDEX, RECONFIG },
  TYPE_FOR_ALL_RESOURCES
} = require('./constants');

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
    if (resourceType !== TYPE_FOR_ALL_RESOURCES) {
      return jobQueue.lib.submitJob(REINDEX, { type: resourceType });
    }

    return Promise.all(getRegisteredResourceTypes().map(type => jobQueue.lib.submitJob(REINDEX, { type })));
  }

  function reconfigure(resourceType) {
    if (resourceType !== TYPE_FOR_ALL_RESOURCES) {
      return jobQueue.lib.submitJob(RECONFIG, { type: resourceType });
    }

    return Promise.all(getRegisteredResourceTypes().map(type => jobQueue.lib.submitJob(RECONFIG, { type })));
  }
};
