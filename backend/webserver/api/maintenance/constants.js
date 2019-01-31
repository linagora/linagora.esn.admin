module.exports = (dependencies) => {
  const { reindex, reconfigure } = require('../../../lib/maintenance/elasticsearch')(dependencies);

  return {
    ACTIONS: {
      reindex,
      reconfigure
    }
  };
};
