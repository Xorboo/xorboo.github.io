"use strict";

var canvas;
var gl;

var isDrawing = false;
var points = [];        // Created points
var pointCenters = [];  // Centers of the lines, used for width computing
var lineLengths = [];   // Ammout of points in each line
var colors=[];			// Created colors

var curCol = [1, 0, 0]; // Selected color
var lineWidth = 0.05;   // Line width
var coloringType = 0;   // Coloring type

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
	
    clearCanvas();

    // Mouse events
	canvas.addEventListener('mousedown', function(evt) {
		isDrawing = true;
        lineLengths.push(points.length);
		addPoint(convertCoordinates(getMousePos(canvas, evt)), true);
	}, false);
	canvas.addEventListener('mousemove', function(evt) {
		if (isDrawing) {
		    addPoint(convertCoordinates(getMousePos(canvas, evt)), false);
        }
	}, false);
	canvas.addEventListener('mouseup', function(evt) {
		isDrawing = false;
		addPoint(convertCoordinates(getMousePos(canvas, evt)), false);
	}, false);
	
    // Color picker
    var div = document.getElementById('color');
    Beehive.Picker(div);
    div.addEventListener('click', function(e) {
        var color = Beehive.getColorCode(e.target);
        if (!color) { console.log('it is not beehive picker color elemnt.'); }
        curCol = color;
    });

    // Sliders
    var widthSlider = document.getElementById("widthSlider");
    var widthScale = 0.005;
    lineWidth = parseFloat(widthSlider.value) * widthScale;
    widthSlider.oninput = function() {
        lineWidth = parseFloat(event.srcElement.value) * widthScale;
    };


	// Render once
    render();
};

function colorTypeChanged(radio) {
    coloringType = parseInt(radio.value);
}

function clearCanvas() {
    console.log("Clear!");
    isDrawing = false;
    points = [];        
    pointCenters = [];  
    lineLengths = [];  
    lineLengths.push(0);  
    colors=[];  
    render();    
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
  }
  
function convertCoordinates(p) {
	return vec2(-1 + 2 * p.x / canvas.width, 1 - 2 * p.y / canvas.height);
}

function addPoint(p, isNewLine) {
    var added = false;
    if (isNewLine) {
        points.push(p, p);
        added = true;
    }
    else {
        var prev = pointCenters[pointCenters.length - 1];
        //C1x=Bx-(Ay-By);  C1y=By+(Ax-Bx);
        //C2x=Bx+(Ay-By);  C2y=By-(Ay-By);
        var delta = vec2(prev[0]-p[0], prev[1]-p[1]);
        var length = Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]);

        if (length > 0.02) {
            var vec = normalize(delta);
            vec[0] *= lineWidth;
            vec[1] *= lineWidth;

            points.push(vec2( p[0] - vec[1], p[1] + vec[0] ));
            points.push(vec2( p[0] + vec[1], p[1] - vec[0] ));

            added = true;
        }
    }

    if (added) {
        pointCenters.push(p);
        lineLengths[lineLengths.length - 1] = points.length; 

        switch(coloringType) {
            case 0: // Standart
                colors.push(curCol[0], curCol[1], curCol[2]);
                colors.push(curCol[0], curCol[1], curCol[2]);
                break;
            case 1: // Darken
                colors.push(curCol[0], curCol[1], curCol[2]);
                colors.push(curCol[0] / 2, curCol[1] / 2, curCol[2] / 2);
                break;
            case 2: // Invert
                colors.push(curCol[0], curCol[1], curCol[2]);
                colors.push(1 - curCol[0], 1 - curCol[1], 1 - curCol[2]);
                break;
            case 3: // Random
                colors.push(Math.random(), Math.random(), Math.random());
                colors.push(Math.random(), Math.random(), Math.random());
                break;
        }
    }

    //colors.push(Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random());  
    render();
}

// Render frame
function render() {
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

    for (var i = 1; i < lineLengths.length; i++) {
        console.log("Draw line!");
        gl.drawArrays( gl.TRIANGLE_STRIP, lineLengths[i - 1], lineLengths[i] - lineLengths[i - 1] );
    }
}

window.onload = init;