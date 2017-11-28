const angular = require('angular');

module.exports = angular.module('orca-pdf-reports.directives', [])
  .component('pdfCard', require('./pdf-card/pdf-card'))
  .component('pdfReport', require('./pdf-report/pdf-report'))
  .name;
