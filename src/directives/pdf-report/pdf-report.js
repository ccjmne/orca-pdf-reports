'use strict';

module.exports = {
  template: `<style>${require('./styles/pdf-report.scss')}</style>${require('./pdf-report.html')}`,
  transclude: {
    body: '?pdfBody',
    title: '?pdfTitle',
    subtitle: '?pdfSubtitle',
    logo: '?pdfLogo',
    bookmark: '?pdfBookmark',
    footer: '?pdfFooter'
  },
  bindings: {
    format: '=',
    pdfContents: '=',
    clone: '=',
    hook: '&',
    hookTrigger: '='
  },
  controller: ['$transclude', '$element', '$attrs', '$parse', '$timeout', 'pdfReport', function ($transclude, $element, $attrs, $parse, $timeout, pdfReport) {
    this.userStyle = pdfReport.userStyle;
    this.hasBookmark = $transclude.isSlotFilled('bookmark');
    $element[0].style.all = 'unset';

    this.$onInit = () => {
      if (!this.hook) {
        return;
      }

      if (this.format instanceof Array) {
        $element.scope().$watchCollection(() => this.format, (classes, previous) => {
          $element[0].classList.remove(...previous);
          $element[0].classList.add(...classes);
          this.notifyHook();
        });
      }

      $element.scope().$watch(() => $attrs.hookTrigger ? this.hookTrigger : $element[0].outerHTML, this.notifyHook, true);
      $element.scope().$on('contenteditable-x.compiled', event => {
        this.notifyHook();
        event.stopPropagation();
      });
    };

    this.notifyHook = () => {
      $timeout(() => {
        const node = $element[0].cloneNode(true);
        node.setAttribute('preview', true);
        if (this.hook) {
          this.hook({
            $clone: node,
            $contents: `<!DOCTYPE html>
              <html>
                  <head>
                      <meta charset='utf-8'>
                      <style>
                          body,
                          html {
                            height: 100%;
                            margin: 0;
                          }

                          pdf-report, .pdf-root {
                            width: 100% !important;
                            height: 100% !important;
                          }

                          ${require('../../styles/print-only.scss')}
                      </style>
                  </head>
                  <body>${node.outerHTML}</body>
              </html>`
          });
        }
      });
    };
  }]
};
