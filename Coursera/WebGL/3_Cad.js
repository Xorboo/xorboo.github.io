"use strict";

// GL
var canvas;
var gl;

// Html elements
var dom = {};

// Shapes
var current = 0;
var shapes = [];

// Color options
var curCol = [1, 0, 0];     // Selected color
var coloringType = 1;       // Coloring type
var fillPolygons = true;    // Fill triangles with color

// Buffer ids
var bufferId;	// Points buffer
var cbufferId;	
var iBuffer;

// Parameters
var vColor;
var colorLoc;
var thetaLoc;
var scaleLoc;
var translateLoc;
var modelViewMatrixLoc;


function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

	// Get buffers and attributes
    iBuffer = gl.createBuffer();
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    cbufferId = gl.createBuffer();
    vColor = gl.getAttribLocation(program, "vColor");

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    colorLoc = gl.getUniformLocation(program, 'fColor');
    thetaLoc = gl.getUniformLocation(program, 'theta');
    scaleLoc = gl.getUniformLocation(program, 'scale');
    translateLoc = gl.getUniformLocation(program, 'translate');
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	
    // Checkboxes
    var chbFilled = document.getElementById("chbFilled");
    fillPolygons = chbFilled.checked;
    chbFilled.onclick = function() {
        fillPolygons = chbFilled.checked;
        //render();
    }

    // Color picker
    var div = document.getElementById('color');
    Beehive.Picker(div);
    div.addEventListener('click', function(e) {
        var color = Beehive.getColorCode(e.target);
        if (!color) { console.log('it is not beehive picker color elemnt.'); }
        curCol = color;
    });

    // Sliders
    dom.sPosX = document.getElementById("sPosX")
    dom.sPosX.oninput = function() {
        shapes[current].translate[0] = event.target.valueAsNumber;
        //render();
    };
    dom.sPosY = document.getElementById("sPosY");
	dom.sPosY.oninput = function() {
        shapes[current].translate[1] = event.target.valueAsNumber;
        //render();
    };
    dom.sPosZ = document.getElementById("sPosZ");
	dom.sPosZ.oninput = function() {
        shapes[current].translate[2] = event.target.valueAsNumber;
        //render();
    };

    dom.sRotX = document.getElementById("sRotX");
	dom.sRotX.oninput = function() {
        shapes[current].theta[0] = event.target.valueAsNumber;
        //render();
    };
    dom.sRotY = document.getElementById("sRotY");
	dom.sRotY.oninput = function() {
        shapes[current].theta[1] = event.target.valueAsNumber;
        //render();
    };
    dom.sRotZ = document.getElementById("sRotZ");
	dom.sRotZ.oninput = function() {
        shapes[current].theta[2] = event.target.valueAsNumber;
        //render();
    };

    dom.sScaleX = document.getElementById("sScaleX");
	dom.sScaleX.oninput = function() {
        shapes[current].scale[0] = event.target.valueAsNumber;
        //render();
    };
    dom.sScaleY = document.getElementById("sScaleY");
	dom.sScaleY.oninput = function() {
        shapes[current].scale[1] = event.target.valueAsNumber;
        //render();
    };
    dom.sScaleZ = document.getElementById("sScaleZ");
	dom.sScaleZ.oninput = function() {
        shapes[current].scale[2] = event.target.valueAsNumber;
        //render();
    };


    dom.selectElement = document.getElementById("shapeSelect");
    dom.selectElement.onchange = function() {
        selectedChange(this.selectedIndex);

        var shape = shapes[current];
        dom.sRotX.value = shape.theta[0];
        dom.sRotY.value = shape.theta[1];
        dom.sRotZ.value = shape.theta[2];

        dom.sScaleX.value = shape.scale[0];
        dom.sScaleY.value = shape.scale[1];
        dom.sScaleZ.value = shape.scale[2];

        dom.sPosX.value = shape.translate[0];
        dom.sPosY.value = shape.translate[1];
        dom.sPosZ.value = shape.translate[2];
    };
	// Render once
    render();
}

function selectedChange(index) {
    current = index;
    var shape = shapes[current];
    if (shape) {
        dom.sRotX.value = shape.theta[0];
        dom.sRotY.value = shape.theta[1];
        dom.sRotZ.value = shape.theta[2];

        dom.sScaleX.value = shape.scale[0];
        dom.sScaleY.value = shape.scale[1];
        dom.sScaleZ.value = shape.scale[2];

        dom.sPosX.value = shape.translate[0];
        dom.sPosY.value = shape.translate[1];
        dom.sPosZ.value = shape.translate[2];
    }

    //render();
}

function colorTypeChanged(radio) {
    coloringType = parseInt(radio.value);
}

function getNewColor() {
    switch(coloringType) {
        case 0: // Standart
            return [curCol[0], curCol[1], curCol[2]];
        case 1: // Random
            return [Math.random(), Math.random(), Math.random()];
    }
    return [0, 0, 0];
}

function addShape(shapeType) {
    var s = Shape.generate(shapeType);

    var shapeInfo = {
        type: shapeType,
        theta: [-110, 0, 0],
        scale: [0.3, 0.3, 0.3],
        translate: [0, 0, 0],
        colors: s.c,
        indexes: s.i,
        vertexes: s.v,
        size: s.i.length
    };
    shapes.push(shapeInfo);

    var opt = document.createElement("option");
    opt.text = shapeType;
    dom.selectElement.add(opt);

    updateIndex(shapes.length - 1);
}
    
function removeShape() {
    shapes.splice(current, 1);
    dom.selectElement.remove(current);

    updateIndex(0);
}

function updateIndex(index) {
    dom.selectElement.selectedIndex = index;
    selectedChange(shapes.length - 1); // Won't call automatically for some reason;
}

function renderShape(shape, isSelected) {
    gl.uniform3fv(thetaLoc, shape.theta);
    gl.uniform3fv(scaleLoc, shape.scale);
    gl.uniform3fv(translateLoc, shape.translate);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(mat4()) );

    // Load vertexes into gl
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertexes), gl.STATIC_DRAW);

    // Load index data onto GPU
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indexes), gl.STATIC_DRAW);

    // Load colors into gl
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.colors), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Draw filled polygons
    if (fillPolygons)
        gl.drawElements( gl.TRIANGLE_STRIP, shape.size, gl.UNSIGNED_SHORT, 0 );

    if (isSelected) {
        // Setting red colros for wireframe for selected item
        var tempColors = shape.colors.slice();
        for(var i = 0; i < tempColors.length; i += 3) {
            tempColors[i] = 1.0;
            tempColors[i+1] = 0.0;
            tempColors[i+2] = 0.0;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(tempColors), gl.STATIC_DRAW);

        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
    } 

    // Draw wireframe
    gl.drawElements( gl.LINE_STRIP, shape.size, gl.UNSIGNED_SHORT, 0 );
}

// Render frame
function render() {
	// Clear frame and draw our triangles
    gl.clear(gl.COLOR_BUFFER_BIT);

    shapes.forEach(function(shape, i, arr) {
      renderShape(shape, i == current);
    });

    requestAnimFrame(render);
}

window.onload = init;