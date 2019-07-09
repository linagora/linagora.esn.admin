module.exports = dependencies => {
  const { ACTIONS } = require('./constants')(dependencies);
  const { getRegisteredResourceTypes } = require('../../../lib/maintenance/elasticsearch')(dependencies);

  return {
    validateMaintenanceAction,
    validateMaintenanceResourceType
  };

  /**
   * Validate maintenance action
   * @param  {Request}   req
   * @param  {Response}  res
   * @param  {Function}  next
   */
  function validateMaintenanceAction(req, res, next) {
    const action = req.query.action;

    if (!ACTIONS[action]) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Bad Request',
          details: `Unsupported action ${action}`
        }
      });
    }

    next();
  }

  /**
   * Validate maintenance resource type
   * @param  {Request}   req
   * @param  {Response}  res
   * @param  {Function}  next
   */
  function validateMaintenanceResourceType(req, res, next) {
    const resourceType = req.query.resource_type;
    const registeredResourceTypes = getRegisteredResourceTypes();

    if (registeredResourceTypes.indexOf(resourceType) !== -1) {
      return next();
    }

    return res.status(400).json({
      error: {
        code: 400,
        message: 'Bad Request',
        details: `Unsupported resource_type ${resourceType}`
      }
    });
  }
};
