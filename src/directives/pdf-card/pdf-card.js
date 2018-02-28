'use strict';

module.exports = {
  restrict: 'E',
  template: require('./pdf-card.html'),
  bindings: {
    add: '&?',
    close: '&?',
    edit: '&?'
  },
  transclude: {
    title: '?cardTitle',
    body: '?cardBody',
    tables: '?cardTable'
  },
  controller: ['$transclude', function ($transclude) {
    this.hasTitle = $transclude.isSlotFilled('title');
    this.hasBody = $transclude.isSlotFilled('body');
  }]
};
