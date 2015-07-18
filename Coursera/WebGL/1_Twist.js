"use strict";

var canvas;
var gl;

var points = [];				// Created points
var colors=[];					// Created colors

var verticesCount = 3; 			// Vertices count of the polygon (3 - triangle, 4 - square etc)
var numTimesToSubdivide = 0; 	// Recursion depth
var angle = 0;					// Twist angle
var dFactor = 1;				// Twist factor

var isColored = false;
var removeCenter = false;
var drawWireframe = false;		// Draw wireframe instead of filled triangles

var bufferId;	// Points buffer
var cbufferId;	
var vColor;



function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	// Get buffers and attributes
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    cbufferId = gl.createBuffer();
    vColor = gl.getAttribLocation( program, "vColor" );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	
	
	// Set listeners to sliders and checkboxes
	var polygonSlider = document.getElementById("polygonSlider");
	verticesCount = parseInt(polygonSlider.value);
	polygonSlider.oninput = function() {
		verticesCount = parseInt(event.srcElement.value);
		render();
	};
	
	var recurseSlider = document.getElementById("recursionSlider");
	numTimesToSubdivide = parseInt(recurseSlider.value);
	recurseSlider.oninput = function() {
		numTimesToSubdivide = parseInt(event.srcElement.value);
		render();
	};
	
	var angleSlider = document.getElementById("angleSlider");
	angle = parseInt(angleSlider.value);
	angleSlider.oninput = function() {
		angle = parseInt(event.srcElement.value);
		render();
	};
	
	var dSlider = document.getElementById("dSlider");
	dFactor = parseInt(dSlider.value);
	dSlider.oninput = function() {
		dFactor = parseInt(event.srcElement.value);
		render();
	};
	
	var chbColored = document.getElementById("chbColored");
	isColored = chbColored.checked;
	chbColored.onclick = function() {
		isColored = chbColored.checked;
		colors = [];
		render();
	}
	
	var chbRemoveCenter = document.getElementById("chbRemoveCenter");
	removeCenter = chbRemoveCenter.checked;
	chbRemoveCenter.onclick = function() {
		removeCenter = chbRemoveCenter.checked;
		render();
	}
	
	var chbWireframe = document.getElementById("chbWireframe");
	removeCenter = chbWireframe.checked;
	chbWireframe.onclick = function() {
		drawWireframe = chbWireframe.checked;
		render();
	}
	
	// Render once
    render();
};

// Add new triangle to points
function triangle(a, b, c) {
    points.push(a, b, c);
}

// Divide triangle recursively
function divideTriangle(a, b, c, count) {
    // check for end of recursion
    if ( count === 0 ) {
        triangle(a, b, c);
    }
    else {
        //bisect the sides
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        --count;

        // four new triangles
        divideTriangle(a, ab, ac, count);
        divideTriangle(c, ac, bc, count);
        divideTriangle(b, bc, ab, count);
		
		if (!removeCenter)
			divideTriangle(ab, ac, bc, count);
    }
}

// Create figure
function createFigure() {
    var vertices = [];
	if (verticesCount > 3)
        vertices.push(vec2(0.0, 0.0)); // Center vertex
	
	var length = 1;
	for(var i = 0; i < verticesCount; i++) {
		var angle = 2 * Math.PI * i / verticesCount;
		var x = length * Math.cos(angle);
		var y = length * Math.sin(angle);
		vertices.push(vec2(x, y));
	}
    points = [];
	if (verticesCount > 3) {
		for(var i = 0; i < vertices.length - 2; i++) {
			divideTriangle( vertices[0], vertices[i + 1], vertices[i + 2], numTimesToSubdivide);
		}
	}
	divideTriangle( vertices[0], vertices[1], vertices[vertices.length - 1], numTimesToSubdivide);

	
	// Set new colors for triangles if needed
	if (colors.length != points.length * 3) {
		colors = [];
		for(var i = 0; i < points.length; i++) {
			if (isColored)
				colors.push(Math.random(), Math.random(), Math.random());
			else
				colors.push(1.0, 0.0, 0.0);
		}
	}
}

// Twist figure
function rotateFigure() {
	var rads = angle * Math.PI / 180;
	points.forEach(function(item, i, arr) { 
		var x = item[0];
		var y = item[1];
		var d = Math.sqrt(x * x + y * y);
		var newAngle = rads * d * dFactor / 10.0;
		var sin = Math.sin(newAngle);
		var cos = Math.cos(newAngle);
		arr[i] = vec2(x * cos - y * sin, x * sin + y * cos);
	});
}

// Render frame
function render() {
	// Create new figure
	createFigure();	
	rotateFigure();
	
	// Load points into gl
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	
	// Load colors into gl
    gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	// Clear frame and draw our triangles
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (drawWireframe) {
    	// Totally unoptimal, but working at least :)
	    for (var i = 0; i < points.length; i += 3)
	    	gl.drawArrays(gl.LINE_LOOP, i, 3); 
    } else { 
    	gl.drawArrays( gl.TRIANGLES, bufferId, points.length );
	}
    points = [];
}

window.onload = init;