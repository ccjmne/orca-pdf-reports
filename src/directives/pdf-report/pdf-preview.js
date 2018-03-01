'use strict';

module.exports = {
  template: `<div style="transform-origin: top left;" ng-style="$ctrl.style()"></div>`,
  bindings: {
    scale: '=',
    of: '='
  },
  controller: ['$element', '$scope', function ($element, $scope) {
    const root = $element.find('div');
    this.dimensions = [0, 0];

    function compileDimensions(size, orientation) {
      const dimensions = {
        a4: [210, 297],
        a3: [297, 420]
      }[size] || [0, 0];
      return orientation === 'portrait' ? dimensions : dimensions.reverse();
    }

    this.style = () => {
      return {
        transform: `scale(${this.scale})`,
        width: `${this.dimensions[0] * this.scale}mm`,
        height: `${this.dimensions[1] * this.scale}mm`
      };
    };

    $scope.$watch(() => this.of, node => {
      if (typeof node === 'undefined') { return; }
      Array.prototype.slice.call(root.children()).forEach(c => c.remove());
      root.append(node);
      const classes = Array.prototype.slice.call(node.classList);
      // jshint bitwise: false
      this.dimensions = compileDimensions(classes.find(x => ~['a4', 'a3'].indexOf(x)), classes.find(x => ~['portrait', 'landscape'].indexOf(x)));
    });
  }]
};
