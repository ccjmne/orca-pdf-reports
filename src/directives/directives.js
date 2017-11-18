const angular = require('angular');

module.exports = angular.module('orca-pdf-reports.directives', [])
  .component('card', require('./card/card'))
  .component('pdfReport', require('./pdf-report/pdf-report'))
  .name;
