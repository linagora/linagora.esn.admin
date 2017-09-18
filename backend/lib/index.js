'use strict';

module.exports = function(dependencies) {
  const maintainES = require('./maintenance/elasticsearch')(dependencies);

  return {
    init
  };

  function init() {
    maintainES.init();
  }
};
