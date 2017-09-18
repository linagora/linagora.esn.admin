'use strict';

module.exports = function(dependencies) {
  const maintainEs = require('../../../lib/maintenance/elasticsearch')(dependencies);
  const ELASTICSEARCH_ACTIONS = {
    users: {
      reconfigure: maintainEs.reconfigUsers,
      reindex: maintainEs.reindexUsers
    }
  };

  return {
    maintainElasticsearch
  };

  function maintainElasticsearch(req, res) {
    const action = req.query.action;
    const resourceType = req.query.resource_type;

    if (ELASTICSEARCH_ACTIONS[resourceType] && ELASTICSEARCH_ACTIONS[resourceType][action]) {
      ELASTICSEARCH_ACTIONS[resourceType][action]();

      return res.status(202).end();
    }

    return res.status(400).json({
      error: {
        code: 400,
        message: 'Bad Request',
        details: `Unsupported action ${action} and resource_type ${resourceType}`
      }
    });
  }
};
