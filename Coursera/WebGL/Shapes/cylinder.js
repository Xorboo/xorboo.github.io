(function(window, ShapeUtils) {
  'use strict';

  var Cylinder = {

    generate: function() {
      var vertices = [],
        normals = [],
        indices = [],
        bottomCap = [],
        topCap = [],
        n = 32,
        startAngle = 0,
        height = 2;

      bottomCap.push(0.0, 0.0, 0.0);
      normals.push(0.0, 0.0, -1.0);

      bottomCap = bottomCap.concat(ShapeUtils.createNgon(n, 0.0));
      for(var i = 3; i < bottomCap.length; i+=3) {
        normals.push(bottomCap[i], bottomCap[i+1], 0.0);
      }

      topCap.push(0.0, 0.0, height);
      normals.push(0.0, 0.0, 1.0);

      topCap = topCap.concat(ShapeUtils.createNgon(n, height));
      for(var i = 3; i < bottomCap.length; i+=3) {
        normals.push(bottomCap[i], bottomCap[i+1], 1.0);
      }

      vertices = bottomCap.concat(topCap);

      var offset = n+1;

      // Index bottom cap
      for (var i=0; i<n; i++) { // [0, 1..n], (0,1,2)..(0,n-1,n),(0,1,n)
        if (i === n - 1) {
          indices.push(n);
          indices.push(1);
          indices.push(0);
        } else {
          indices.push(0);
          indices.push(i+1);
          indices.push(i+2);
        }
      }

      indices.push(0);
      indices.push(0);
      indices.push(0);

      // Index top cap
      for (var i=0; i<n; i++) {
        if (i === n - 1) {
          indices.push(offset);
          indices.push(1 + offset);
          indices.push(n + offset);
        } else {
          indices.push(i+2 + offset);
          indices.push(i+1 + offset);
          indices.push(offset);
        }
      }

      // Index tube connecting top and bottom
      for (var i=1; i<=n; i++) {

        // Special handling to "wrap it up"
        if (i === n) {

          // bot triangle
          indices.push(i + offset);
          indices.push(1);
          indices.push(i);

          // top triangle
          indices.push(i + offset);
          indices.push(1 + offset);
          indices.push(1);

        } else {

          // bot triangle
          indices.push(i + 1 + offset);
          indices.push(i+1);
          indices.push(i);

          // top triangle
          indices.push(i);
          indices.push(i + offset);
          indices.push(i + 1 + offset);
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

  window.Cylinder = Cylinder;

})(window, window.ShapeUtils);