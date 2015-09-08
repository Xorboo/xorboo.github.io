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
var curCol = [1.0, 1.0, 1.0];     // Selected color
var curShininess = 100;
var curAttenuation = 0;

// Pattern options
var texSize = 64;
var numChecks = 8;

// Buffer ids
var bufferId;	// Points buffer
var cbufferId;	
var iBuffer;
var nBuffer;
var tBuffer;

// Parameters
var vColor;
var vNormal;
var colorLoc;
var thetaLoc;
var scaleLoc;
var translateLoc;


var ambientLoc;
var diffuseLoc;
var specularLoc;
var lightsPositionsLoc;
var shininessLoc;
var attenuationLoc;

var textureLoc;
var vTexCoord;

var texture;
var patternImage;
var fileImage;

var textureMappingMethod = 'spherical';


// Lights
var lights = 
[ 
    { // Movable light
        pos: vec4(1.0, 0.0, 1.0, 0.0),
        ambient: vec4(0.3, 0.3, 0.3, 1.0),
        diffuse: vec4(1.0, 1.0, 1.0, 1.0),
        specular: vec4(1.0, 1.0, 1.0, 1.0),
        enabled: true
    },
    { // Animated light
        pos: vec4(-1.0, 0.5, 1.0, 0.0),
        ambient: vec4(0.3, 0.3, 0.3, 1.0),
        diffuse: vec4(1.0, 0.2, 0.2, 1.0),
        specular: vec4(1.0, 1.0, 1.0, 1.0),
        enabled: false
    }
];
var lightAngle = 0;

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 100.0;

var textureType = "file";

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.98, 0.98, 0.98, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);

    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

	// Get buffers and attributes
    iBuffer = gl.createBuffer();
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    cbufferId = gl.createBuffer();
    vColor = gl.getAttribLocation(program, "vColor");
    nBuffer = gl.createBuffer();
    tBuffer = gl.createBuffer();

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, 'theta');
    scaleLoc = gl.getUniformLocation(program, 'scale');
    translateLoc = gl.getUniformLocation(program, 'translate');
    vNormal = gl.getAttribLocation(program, "vNormal");


    ambientLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularLoc = gl.getUniformLocation(program, "specularProduct");
    lightsPositionsLoc = gl.getUniformLocation(program, "lightPositions");
    shininessLoc = gl.getUniformLocation(program, "shininess");
    attenuationLoc = gl.getUniformLocation(program, "attenuation");

    textureLoc = gl.getUniformLocation(program, 'texture');
    vTexCoord = gl.getAttribLocation(program, 'vTexCoord');

    var projection = ortho(-1, 1, -1, 1, -100, 100);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));

    // Colors
    var div = document.getElementById('color');
    Beehive.Picker(div);
    div.addEventListener('click', function(e) {
        var color = Beehive.getColorCode(e.target);
        if (!color) {  // Color get lost sometimes
            console.log('it is not beehive picker color elemnt.'); 
            return; 
        }
        curCol = color;

        if (current >= 0 && shapes.length > 0)
            shapes[current].color = curCol
    });
    dom.sShininess = document.getElementById("sShininess")
    dom.sShininess.oninput = function() {
        curShininess = event.target.valueAsNumber;
        shapes[current].shininess = curShininess;
    };
    dom.sAttenuation = document.getElementById("sAttenuation")
    dom.sAttenuation.oninput = function() {
        curAttenuation = event.target.valueAsNumber;
    };

    dom.sRotX = document.getElementById("sRotX");
	dom.sRotX.oninput = function() {
        shapes[current].theta[0] = event.target.valueAsNumber;
    };
    dom.sRotY = document.getElementById("sRotY");
	dom.sRotY.oninput = function() {
        shapes[current].theta[1] = event.target.valueAsNumber;
        //render();
    };
    dom.sRotZ = document.getElementById("sRotZ");
	dom.sRotZ.oninput = function() {
        shapes[current].theta[2] = event.target.valueAsNumber;
    };

    dom.sLPosX = document.getElementById("sLPosX")
    dom.sLPosX.oninput = function() {
        lights[0].pos[0] = event.target.valueAsNumber;
    };
    dom.sLPosY = document.getElementById("sLPosY");
    dom.sLPosY.oninput = function() {
        lights[0].pos[1] = event.target.valueAsNumber;
    };
    dom.sLPosZ = document.getElementById("sLPosZ");
    dom.sLPosZ.oninput = function() {
        lights[0].pos[2] = event.target.valueAsNumber;
    };

    dom.chbLight1 = document.getElementById("chbLight1");
    dom.chbLight1.onclick = function() {
        lights[0].enabled = dom.chbLight1.checked;
    };
    dom.chbLight2 = document.getElementById("chbLight2");
    dom.chbLight2.onclick = function() {
        lights[1].enabled = dom.chbLight2.checked;
    };

    // Moving light
    var timerID = setInterval(function() {
      lightAngle += 0.3 / Math.PI;
      var pos = lights[1].pos;
      var dist = 2;
      pos[0] = dist * Math.sin(lightAngle);
      pos[2] = dist * Math.cos(lightAngle);
    }, 30);
	// Render once

    addShape("Sphere");
    //patternSelected();
    loadTextureFile("stones.jpg");
    render();
};


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
};

function getNewColor() {
    return curCol;
};

function addShape(shapeType) {
    var s = Shape.generate(shapeType);

    var shapeInfo = {
        type: shapeType,
        theta: [30, 30, 0],
        scale: [0.9, 0.9, 0.9],
        translate: [0, 0, 0],
        colors: s.c,
        indexes: s.i,
        vertexes: s.v,
        normals: s.n,
        size: s.i.length,
        texCoords: s.texCoords,

        color: s.color,
        shininess: s.shininess
    };
    shapes.push(shapeInfo);
}
    
function removeShape() {
    shapes.splice(current, 1);
    dom.selectElement.remove(current);
}

function renderShape(shape, isSelected) {
    gl.uniform3fv(thetaLoc, shape.theta);
    gl.uniform3fv(scaleLoc, shape.scale);
    gl.uniform3fv(translateLoc, shape.translate);

    // Load vertexes into gl
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertexes), gl.STATIC_DRAW);

    // Load index data onto GPU
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indexes), gl.STATIC_DRAW);

    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(shape.normals), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );


    // Coloring
    var zeroCol = vec4(0.0, 0.0, 0.0, 1.0); // zero color for disabled lights
    var col = vec4(shape.color[0], shape.color[1], shape.color[2], 1.0);

    var ambient = [], diffuse = [], specular = [], positions = [];
    lights.forEach(function(light, i, arr) {
        ambient = ambient.concat(light.enabled ? mult(light.ambient, col) : zeroCol);
        diffuse = diffuse.concat(light.enabled ? mult(light.diffuse, col) : zeroCol);
        specular = specular.concat(light.enabled ? mult(light.specular, col) : zeroCol);
        positions = positions.concat(light.pos);
    });
    gl.uniform4fv(ambientLoc, flatten(ambient));
    gl.uniform4fv(diffuseLoc, flatten(diffuse));
    gl.uniform4fv(specularLoc, flatten(specular));
    gl.uniform4fv(lightsPositionsLoc, flatten(positions));
    gl.uniform1f(shininessLoc, shape.shininess);


    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.texCoords[textureMappingMethod]), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    // Draw filled polygons
    gl.drawElements( gl.TRIANGLES, shape.size, gl.UNSIGNED_SHORT, 0 );
}

// Render frame
function render() {
	// Clear frame and draw our triangles
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(attenuationLoc, curAttenuation);

    shapes.forEach(function(shape, i, arr) {
      renderShape(shape, i == current);
    });

    requestAnimFrame(render);
}

function mappingChanged(newType) {
    textureMappingMethod = newType;
}

function patternSelected() {
    textureType = 'pattern';
    patternImage = createPattern();
    configureTexture(patternImage);
}

function loadTextureFile(textureFileUrl) {
    textureType = 'file';
    fileImage = new Image();
    fileImage.onload = function() {
        configureTexture(fileImage);
    };
    fileImage.onerror = function() {
      console.error('Unable to load image: ' + textureFileUrl);
    };
    fileImage.src = "./Images/" +textureFileUrl;
  };

function  createPattern() {
    var c,
    imageData = new Uint8Array(4*texSize*texSize),
    patchx, patchy;

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            patchx = Math.floor(i/(texSize/numChecks));
            patchy = Math.floor(j/(texSize/numChecks));

            if (patchx%2 ^ patchy%2) {
                c = 255;
                } else {
                c = 0;
            }

            imageData[4*i*texSize+4*j] = c;
            imageData[4*i*texSize+4*j+1] = c;
            imageData[4*i*texSize+4*j+2] = c;
            imageData[4*i*texSize+4*j+3] = 255;
        }
    }

    return imageData;
}


function configureTexture(image) {
    texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    if (textureType === 'file') {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    }

    if (textureType === 'pattern') {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(textureLoc, 0);
};

window.onload = init;