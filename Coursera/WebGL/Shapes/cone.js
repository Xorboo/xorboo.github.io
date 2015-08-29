(function(window, ShapeUtils) {
  'use strict';

  var Cone = {

    generate: function() {
      var vertices = [],
        normals = [],
        indices = [],
        bottomCap = [],
        topPoint = [],
        n = 32,
        height = 2.0,
        startAngle = 1;

      bottomCap.push(0.0, 0.0, 0.0);
      normals.push(0, 0, -1.0);
      bottomCap = bottomCap.concat(ShapeUtils.createNgon(n, 0.0));
      for(var i = 3; i < bottomCap.length; i+=3) {
        normals.push(bottomCap[i], bottomCap[i+1], 0.0);
      }
      topPoint.push(0.0, 0.0, height);
      normals.push(0, 0, 1.0);

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
        normals.push(vec3(0.0, 0.0, -1.0));
      }


      // Join top point to bottom cap
      for (var j=1; j<=n; j++) {
        if (j === n) {
          indices.push(1);
          indices.push(j);
          indices.push(n+1);
        } else {
          indices.push(j+1);
          indices.push(j);
          indices.push(n+1);
        }
      }

      return {
        v: vertices,
        i: indices,
        n: normals,

        color: curCol,
        shininess: curShininess
      };
    }

  };

  window.Cone = Cone;

})(window, window.ShapeUtils);