/*
	Shape generation methods partially taken from https://github.com/danielabar/coursera-webgl and fixed to make good filling color
*/
(function(window) {
  'use strict';

  var Shape = {
    generate: function(shapeName, opts) {
      return window[shapeName].generate(opts);
    }
  };

  window.Shape = Shape;

})(window);