(function(window) {
  'use strict';

  var ShapeUtils = {

    createNgon: function (n, z) {
      var vertices = [],
  		  dA = Math.PI*2 / n,
        r = 1,
        angle,
        x, y;

      for (var i=0; i < n; i++) {
        angle = dA*i;
        x = r * Math.cos(angle);
        y = r * Math.sin(angle);
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
      }
      return vertices;
    }

  };

  window.ShapeUtils = ShapeUtils;
})(window);