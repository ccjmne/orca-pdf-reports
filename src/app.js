'use strict';

require('style-loader!./styles/live-only.scss');
require('style-loader!./styles/print-only.scss');

const angular = require('angular');

require('angular-content-editable');

module.exports = angular.module('pdf-reports', [require('./directives/directives'), 'angular-content-editable'])
  .directive('contenteditableX', ['$compile', '$parse', '$timeout', function ($compile, $parse, $timeout) {
    return {
      transclude: true,
      replace: true,
      template: (elem, attrs) => `
      <span
          content-editable single-line="true" focus-select="false"
          ng-model="${attrs.model || `__contenteditablex_${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}`}"
          ng-transclude></span>`,
      link: function (scope, element, attrs) {
        scope.$watch(() => `${$parse(attrs.ngModel)(scope)}:${element[0] === document.activeElement}`, () => $timeout(() => {
          if (element[0] === document.activeElement) {
            // decompile <span ng-bind="expr"></span> into {{expr}} notation
            element.html(element[0].innerHTML.replace(/<span\s+ng-bind="([^"]+)"(?:\s+[\w-]+(?:="[^"]+")?)*>.*?<\/span>/g, '{{$1}}'));
          } else {
            // compile {{expr}} notation to <span ng-bind="expr"></span>
            element.html(element[0].innerHTML.replace(/\{\{([^}]+)\}\}/g, (match, model) => `<span ng-bind="${model.toLowerCase()}"></span>`));
            $compile(element[0].querySelectorAll('span'))((attrs.scope ? Object.assign(scope.$new(true), $parse(attrs.scope)(scope)) : scope));
            scope.$emit('contenteditable-x.compiled');
          }
        }, 0));
      }
    };
  }])
  .directive('getPdf', ['$http', function ($http) {
    const apiSvc = {
      post: function (url, data, config) {
        return $http.post(
          encodeURI(url),
          JSON.stringify(data || {}),
          {... config, headers: {'Content-Type': 'application/json'}}
        );
      }
    };

    return {
      template: `<button ng-click="getPDF()">Get PDF</button>`,
      scope: { pdfContents: '=', size: '=', orientation: '=' },
      link: function (scope, elem, attrs) { // jshint ignore: line
        scope.getPDF = function () {
          apiSvc.post('//localhost:3000/multiple', [scope.pdfContents], {
            responseType: 'arraybuffer',
            params: {
              format: scope.size,
              landscape: scope.orientation === 'landscape'
            }
          }).then((data) => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([data.data], { type: 'application/pdf;charset=utf-8' }));
            a.download = 'asdf.pdf';
            a.click();
          });
        };
      }
    };
  }])
  .name;
