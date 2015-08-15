(function(window, ShapeUtils) {
  'use strict';

  var Cone = {

    generate: function() {
      var vertices = [],
        indices = [],
        bottomCap = [],
        topPoint = [],
        n = 32,
        startAngle = 1;

      bottomCap.push(0.0, 0.0, 0.0);
      bottomCap = bottomCap.concat(ShapeUtils.createNgon(n, 0.0));
      topPoint.push(0.0, 0.0, 1.9);

      vertices = bottomCap.concat(topPoint);

      // Index bottom cap
      for (var i=0; i<=n; i++) {
        if (i === n) {
          indices.push(0);
          indices.push(n);
          indices.push(1);
        } else {
          indices.push(0);
          indices.push(i+1);
          indices.push(i+2);
        }
      }

      // Join top point to bottom cap
      for (var j=1; j<=n; j++) {
        if (j === n) {
          indices.push(n+1);
          indices.push(j);
          indices.push(1);
        } else {
          indices.push(n+1);
          indices.push(j);
          indices.push(j+1);
        }
      }

      var colors = [];
      for(var i=0; i<indices.length; i++) {
        colors.push(getNewColor(), getNewColor(), getNewColor());
      }
      
      return {
        v: vertices,
        i: indices,
        c: colors
      };

    }

  };

  window.Cone = Cone;

})(window, window.ShapeUtils);