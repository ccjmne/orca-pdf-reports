'use strict';

const angular = require('angular');

module.exports = angular.module('orca-pdf-reports.directives', [])
  .provider('pdfReport', function () {
    this.setUserStyle = style => this.$get = () => { return { userStyle: style }; };
    this.setUserStyle('');
  })
  .component('pdfCard', require('./pdf-card/pdf-card'))
  .component('pdfReport', require('./pdf-report/pdf-report'))
  .component('pdfPreview', require('./pdf-report/pdf-preview'))
  .name;
