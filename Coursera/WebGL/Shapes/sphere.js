(function(window) {
  'use strict';

  var Sphere = {

    generate: function(opts) {
      var lats = 32,
        longs = 32,
        radius = 1,
        vertices = [],
        normals = [],
        indices = [];

      for (var latNumber = 0; latNumber <= lats; ++latNumber) {
        for (var longNumber = 0; longNumber <= longs; ++longNumber) {
          var theta = latNumber * Math.PI / lats;
          var phi = longNumber * 2 * Math.PI / longs;
          var sinTheta = Math.sin(theta);
          var sinPhi = Math.sin(phi);
          var cosTheta = Math.cos(theta);
          var cosPhi = Math.cos(phi);

          var x = cosPhi * sinTheta;
          var y = cosTheta;
          var z = sinPhi * sinTheta;

          vertices.push(radius * x);
          vertices.push(radius * y);
          vertices.push(radius * z);
        }
      }

      for (var latNumberI = 0; latNumberI < lats; ++latNumberI) {
        for (var longNumberI = 0; longNumberI < longs; ++longNumberI) {
          var first = (latNumberI * (longs+1)) + longNumberI;
          var second = first + longs + 1;
          indices.push(first);
          indices.push(second);
          indices.push(first+1);

          indices.push(second);
          indices.push(second+1);
          indices.push(first+1);
        }
      }

      for(var i = 0; i < vertices.length; i+=3) {
        var vert = vec3(vertices[i], vertices[i + 1], vertices[i + 2]);
        normals.push(normalize(vert));
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

  window.Sphere = Sphere;

})(window);