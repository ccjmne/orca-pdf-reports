'use strict';

require('style-loader!./styles/no-print.scss');

const angular = require('angular');
const _ = require('lodash');

module.exports = angular.module('pdf-reports', [require('angular-file-saver'), require('./directives/directives')])
  .directive('getPdf', ['$http', '$q', 'FileSaver', function ($http, $q, FileSaver) {
    const apiSvc = {
      post: function (url, data, config) {
        return $http.post(encodeURI(url), JSON.stringify(data || {}), _.chain({ headers: { 'Content-Type': 'application/json' } }).clone().extend(config).value());
      }
    };

    return {
      template: `<form ng-submit="getPDF()">
          <select ng-model="size" ng-options="size for size in ['A4', 'A3']" ng-init="size = 'A4'"></select>
          <select ng-model="orientation" ng-options="orientation for orientation in ['Portrait', 'Landscape']" ng-init="orientation = 'Portrait'"></select>
          <button type="submit">Get PDF</button>
      </form>`,
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
                          <style>body, html { height: 100%; margin: 0; font-size: 1.1em; }</style>
                      </head>
                      <body>${doc.outerHTML}</body>
                  </html>`,
                orientation: scope.orientation,
                size: scope.size
              }, { responseType: 'arraybuffer' })
              .then((data) => FileSaver.saveAs(new Blob([data.data], { type: 'application/pdf;charset=utf-8' }), 'lolz.pdf', true));
          }('pdf-report'));
        };
      }
    };
  }])
  .component('pdfReport', {
    template: require('!html-loader?interpolate!./assets/pdf-report.html'),
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
  })
  .name;
