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
  controller: ['$transclude', '$element', '$attrs', '$parse', '$timeout', 'pdfReport', function ($transclude, $element, $attrs, $parse, $timeout, pdfReport) {
    this.userStyle = pdfReport.userStyle;
    this.hasBookmark = $transclude.isSlotFilled('bookmark');
    $element[0].style.all = 'unset';

    // Expose the element's HTML contents through the scope variable defined via its 'pdf-contents' attribute
    if ($attrs.pdfContents) {
      const notify = html => $timeout($parse($attrs.pdfContents).assign.bind(null, $element.scope(), html), 0);
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
