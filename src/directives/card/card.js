'use strict';

module.exports = {
  restrict: 'E',
  template: require('./card.html'),
  transclude: {
    title: '?cardTitle',
    body: '?cardBody',
    table: '?table'
  },
  controller: function ($transclude) {
    this.$inect = '$transclude';
    this.hasTitle = $transclude.isSlotFilled('title');
    this.hasBody = $transclude.isSlotFilled('body');
  }
};
