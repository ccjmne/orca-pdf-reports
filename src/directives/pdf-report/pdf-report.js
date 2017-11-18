'use strict';

module.exports = {
  template: require('!html-loader?interpolate!./pdf-report.html'),
  transclude: {
    body: 'pdfBody',
    title: '?pdfTitle',
    logo: '?pdfLogo',
    bookmark: '?pdfBookmark',
    footer: '?pdfFooter'
  },
  controller: ['$transclude', function ($transclude) {
    this.hasBookmark = $transclude.isSlotFilled('bookmark');
  }]
};
