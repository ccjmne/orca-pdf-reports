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
  controller: ['$transclude', '$element', '$attrs', '$parse', function ($transclude, $element, $attrs, $parse) {
    this.hasBookmark = $transclude.isSlotFilled('bookmark');
    $element[0].style.all = 'unset';

    // Expose the HTML contents through the scope variable defined via pdfContents
    if ($attrs.pdfContents) {
      const notify = ((assign) => assign.bind(assign, $element.scope()))($parse($attrs.pdfContents).assign);
      $element.scope().$watch(() => $element[0].outerHTML, html => notify(`<!DOCTYPE html>
          <html>
              <head>
                  <meta charset='utf-8'>
                  <style>${require('../../styles/print-only.scss')}</style>
              </head>
              <body>${html}</body>
          </html>`));
    }
  }]
};
