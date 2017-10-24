'use strict';

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./card.html'),
    transclude: {
      title: '?cardTitle',
      body: 'cardBody'
    }
  };
};
