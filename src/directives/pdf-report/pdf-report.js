'use strict';

module.exports = {
  template: require('!html-loader?interpolate!./pdf-report.html'),
  transclude: {
    body: 'pdfBody',
    title: '?pdfTitle',
    subtitle: '?pdfSubtitle',
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
      $element.scope().$watch(() => $element[0].outerHTML, () => {
        const node = $element[0].cloneNode(true);
        node.setAttribute('preview', true);
        notify(`<!DOCTYPE html>
        <html>
            <head>
                <meta charset='utf-8'>
                <style>
                    body,
                    html {
                      height: 100%;
                      margin: 0;
                      font-size: 1.1em;
                    }
                    ${require('../../styles/print-only.scss')}
                </style>
            </head>
            <body>${node.outerHTML}</body>
        </html>`);
      });
    }
  }]
};
