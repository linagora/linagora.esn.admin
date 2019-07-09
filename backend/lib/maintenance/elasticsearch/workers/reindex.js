const { REINDEX } = require('../constants').JOBQUEUE_WORKER_NAMES;

module.exports = dependencies => {
  const elasticsearch = dependencies('elasticsearch');

  return {
    name: REINDEX,
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

    return registeredResources[type].buildReindexOptionsFunction()
      .then(options => elasticsearch.reindex(options));
  }

  function getTitle(jobData) {
    return `Reindex ElasticSearch data for ${jobData.type}`;
  }
};
