'use strict';

module.exports = {
  restrict: 'E',
  template: require('./pdf-card.html'),
  bindings: {
    add: '&?'
  },
  transclude: {
    title: '?cardTitle',
    body: '?cardBody',
    table: '?table'
  },
  controller: ['$transclude', function ($transclude) {
    this.hasTitle = $transclude.isSlotFilled('title');
    this.hasBody = $transclude.isSlotFilled('body');
  }]
};
