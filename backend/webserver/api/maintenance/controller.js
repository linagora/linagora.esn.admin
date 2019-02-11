module.exports = (dependencies) => {
  const logger = dependencies('logger');
  const maintainEs = require('../../../lib/maintenance/elasticsearch')(dependencies);
  const { ACTIONS } = require('./constants')(dependencies);

  return {
    getRegisteredTypes,
    maintainElasticsearch
  };

  function getRegisteredTypes(req, res) {
    return res.status(200).json(maintainEs.getRegisteredResourceTypes());
  }

  function maintainElasticsearch(req, res) {
    const { action, resource_type } = req.query;

    ACTIONS[action](resource_type)
      .then(() => res.status(202).end())
      .catch((err) => {
        const details = `Error while submiting ${action} job for resource type ${resource_type}`;

        logger.error(details, err);

        return res.status(500).json({
          error: {
            code: 500,
            message: 'Server Error',
            details
          }
        });
      });
  }
};
