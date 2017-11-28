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
      scope: { pdfContents: '=' },
      link: function (scope, elem, attrs) { // jshint ignore: line
        scope.getPDF = function () {
          apiSvc.post('//localhost:8080/api/reports', {
              content: `<!DOCTYPE html>
                  <html>
                      <head>
                          <meta charset="utf-8">
                          <style>body, html { height: 100%; margin: 0; font-size: 1.1em; }</style>
                      </head>
                      <body>${scope.pdfContents}</body>
                  </html>`,
              orientation: scope.orientation,
              size: scope.size
            }, { responseType: 'arraybuffer' })
            .then((data) => FileSaver.saveAs(new Blob([data.data], { type: 'application/pdf;charset=utf-8' }), 'lolz.pdf', true));
        };
      }
    };
  }])
  .name;
