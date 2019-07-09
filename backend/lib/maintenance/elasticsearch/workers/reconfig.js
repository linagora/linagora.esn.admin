const { RECONFIG } = require('../constants').JOBQUEUE_WORKER_NAMES;

module.exports = dependencies => {
  const elasticsearch = dependencies('elasticsearch');

  return {
    name: RECONFIG,
    handler: {
      handle,
      getTitle
    }
  };

  function handle(job) {
    const { type } = job.data;
    const registeredResources = elasticsearch.reindexRegistry.getAll();

    if (!registeredResources[type]) {
      return Promise.reject(new Error(`There is no corresponding index for: ${type}`));
    }

    return elasticsearch.reconfig(registeredResources[type].name, type);
  }

  function getTitle(jobData) {
    return `Reconfigure ElasticSearch configuration for ${jobData.type}`;
  }
};
