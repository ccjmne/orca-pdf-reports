'use strict';

const angular = require('angular');
const _ = require('lodash');

module.exports = angular.module('pdf-reports', [require('angular-file-saver')])
  .directive('getPdf', ['$http', '$q', 'FileSaver', function ($http, $q, FileSaver) {
    const apiSvc = {
      post: function (url, data, config) {
        return $http.post(encodeURI(url), JSON.stringify(data || {}), _.chain({ headers: { 'Content-Type': 'application/json' } }).clone().extend(config).value());
      }
    };

    return {
      template: '<button ng-click="getPDF()">Get PDF</button>',
      scope: true,
      link: function (scope, elem, attrs) { // jshint ignore: line
        scope.getPDF = function () {
          (function (selector) {
            const doc = (selector ? document.querySelector(selector) : document.documentElement).cloneNode(true);
            apiSvc.post('//localhost:8080/api/reports', {
                content: `<!DOCTYPE html>
                  <html>
                      <head>
                          <meta charset="utf-8">
                          <style>body, html, pdf-report { height: 100%; margin: 0; }</style>
                      </head>
                      <body>${doc.outerHTML}</body>
                  </html>`,
                orientation: 'Landscape',
                size: 'A3'
              }, { responseType: 'arraybuffer' })
              .then((data) => FileSaver.saveAs(new Blob([data.data], { type: 'application/pdf;charset=utf-8' }), 'lolz.pdf', true));
          }('pdf-report'));
        };
      }
    };
  }])
  .directive('pdfReport', [function () {
    return {
      template: require('!html-loader?interpolate!./assets/pdf-report.html'),
      transclude: {
        body: 'pdfBody',
        logo: '?pdfLogo',
        header: '?pdfHeader',
        footer: '?pdfFooter'
      },
      restrict: 'E'
    };
  }])
  .name;
