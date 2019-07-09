module.exports = dependencies => {
  const logger = dependencies('logger');
  const { EsnConfig } = dependencies('esn-config');

  return {
    updateAutoconf
  };

  function updateAutoconf(req, res) {
    const config = {
      name: 'autoconf',
      value: req.body
    };

    return new EsnConfig('core', req.domain.id).set(config)
      .then(() => res.status(204).send())
      .catch(error => {
        logger.error('Unable to save autoconf configuration', error);

        res.status(500).json({
          error: {
            code: 500,
            message: 'Server Error',
            details: 'Unable to save autoconf configuration'
          }
        });
      });
  }
};
