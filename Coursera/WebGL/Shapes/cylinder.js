(function(window, ShapeUtils) {
  'use strict';

  var Cylinder = {

    generate: function() {
      var vertices = [],
        indices = [],
        bottomCap = [],
        topCap = [],
        n = 32,
        startAngle = 0,
        height = 2;

      bottomCap.push(0.0, 0.0, 0.0);
      bottomCap = bottomCap.concat(ShapeUtils.createNgon(n, 0.0));
      topCap.push(0.0, 0.0, height);
      topCap = topCap.concat(ShapeUtils.createNgon(n, height));

      vertices = bottomCap.concat(topCap);

      // Index bottom cap
      for (var i=0; i<n; i++) {
        if (i === n - 1) {
          indices.push(0);
          indices.push(n);
          indices.push(1);
        } else {
          indices.push(0);
          indices.push(i+1);
          indices.push(i+2);
        }
      }

      // Index top cap
      var offset = n+1;
      for (var j=0; j<n; j++) {
        if (j === n-1) {
          indices.push(offset);
          indices.push(n + offset);
          indices.push(1 + offset);
        } else {
          indices.push(offset);
          indices.push(j+1 + offset);
          indices.push(j+2 + offset);
        }
      }

      // Index tube connecting top and bottom
      for (var k=1; k<=n-1; k++) {

        // Special handling to "wrap it up"
        if (k === n-1) {

          // first triangle
          indices.push(k);
          indices.push(1);
          indices.push(k + offset);

          // second triangle
          indices.push(k);
          indices.push(1 + offset);
          indices.push(k + offset);

        } else {

          // first triangle
          indices.push(k);
          indices.push(k+1);
          indices.push(k + 1 + offset);

          // second triangle
          indices.push(k);
          indices.push(k + offset);
          indices.push(k + 1 + offset);
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

  window.Cylinder = Cylinder;

})(window, window.ShapeUtils);