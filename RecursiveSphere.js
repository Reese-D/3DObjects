/**
 * Created by Reese De Wind on 2/19/17.
 */
class RecursiveSphere {
    /**
     * Create a 3D cone with tip at the Z+ axis and base on the XY plane
     * @param {Object} gl      the current WebGL context
     * @param {Number} radius  radius of the cone base
     * @param {Number} height  height of the cone
     * @param {Number} subDiv  number of radial subdivision of the cone base
     * @param {vec3}   col1    color #1 to use
     * @param {vec3}   col2    color #2 to use
     */

    scalePoint(point, desiredRadius){
	let lenAB = Math.sqrt(Math.pow(point[0] , 2.0) + Math.pow(point[1], 2.0) + Math.pow(point[2], 2.0));
	let newPoint = []
	for(let i = 0; i < 3; i++){
	    newPoint[i] = point[i] / lenAB * desiredRadius;
	}
	// console.log("----------scalePoint----------");
	// console.log(point);
	// console.log(newPoint);
	return newPoint;
    }

    averagePoints(point1, point2){
	let newPoint = [];
	for(let i = 0; i < 3; i++){
	    newPoint.push((point1[i] + point2[i]) / 2);
	}
	// console.log("----------averagePoints----------");
	// console.log(point1);
	// console.log(point2);
	// console.log(newPoint);
	return newPoint;
    }
    
    divideTriangle(points, radius, recursions, startIndex){
	let allPoints = []
	let connections = [];

	let midPointAB = this.scalePoint(this.averagePoints(points[0], points[1]), radius);
	let midPointAC = this.scalePoint(this.averagePoints(points[0], points[2]), radius);
	let midPointBC = this.scalePoint(this.averagePoints(points[1], points[2]), radius);

	allPoints = allPoints.concat(midPointBC, midPointAC, midPointAB);
	let temp = []
	if(recursions != 0){
	    temp = this.divideTriangle([points[0], midPointAC, midPointAB], radius, recursions-1, startIndex);
	    allPoints = allPoints.concat(temp[0])
	    connections = connections.concat(temp[1]);
	    temp = this.divideTriangle([midPointAB, midPointBC, points[1]], radius, recursions-1, Math.max.apply(null,connections));
	    allPoints = allPoints.concat(temp[0])
	    connections = connections.concat(temp[1]);
	    temp = this.divideTriangle([midPointAC, points[2],midPointBC], radius, recursions-1, Math.max.apply(null,connections));
	    allPoints = allPoints.concat(temp[0])
	    connections = connections.concat(temp[1]);
	    temp = this.divideTriangle([midPointBC, midPointAC, midPointAB], radius, recursions-1, Math.max.apply(null,connections) );
	    allPoints = allPoints.concat(temp[0])
	    connections = connections.concat(temp[1]);
	}else{
	    connections.push(startIndex,startIndex+3,startIndex+5);
	    connections.push(startIndex+5,startIndex+4,startIndex+2);
	    connections.push(startIndex+3,startIndex+4,startIndex+5);
	    connections.push(startIndex+3,startIndex+1,startIndex+4);
	}
	return [allPoints, connections];
    }


    constructor (gl, subDiv, col1, col2) {
	/* if colors are undefined, generate random colors */
	if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());
	if (typeof col2 === "undefined") col2 = vec3.fromValues(Math.random(), Math.random(), Math.random());
	let randColor = vec3.create();
	let vertices = [];
	let sphere = []
	sphere.push([0.8,0.8,0.8]);
	sphere.push([-0.8,-0.8,0.8]);
	sphere.push([-0.8,0.8,-0.8]);
	sphere.push([0.8,-0.8,-0.8]);
	console.log(sphere);
	let allPoints = [];
	let temp = [];
	let connections = [];


	temp = this.divideTriangle([sphere[0],sphere[1],sphere[3]], 0.8, subDiv,0);
	allPoints =allPoints.concat(temp[0]);
	connections = connections.concat(temp[1]);


	temp = this.divideTriangle([sphere[2],sphere[1],sphere[3]], 0.8, subDiv, Math.max.apply(null,connections));
	allPoints = allPoints.concat(temp[0]);
	connections = connections.concat(temp[1]);


	temp = this.divideTriangle([sphere[2],sphere[0],sphere[3]], 0.8, subDiv, Math.max.apply(null,connections));
	allPoints = allPoints.concat(temp[0]);
	connections = connections.concat(temp[1]);


	temp = this.divideTriangle([sphere[1],sphere[2],sphere[0]], 0.8, subDiv, Math.max.apply(null,connections));
	allPoints = allPoints.concat(temp[0]);
	connections = connections.concat(temp[1]);

	allPoints = [].concat.apply(allPoints, []);
	console.log("-----------------------------------------------final--------------------------------------------");
	console.log(allPoints);
	for(let currPoint = 0; currPoint < allPoints.length/3 ; currPoint++){
	    vertices.push(allPoints[currPoint*3], allPoints[currPoint*3+1], allPoints[currPoint*3+2]);
	    vec3.lerp (randColor, col1, col2, Math.random());
	    vertices.push(randColor[0], randColor[1], randColor[2]);
	}
	console.log(vertices.length)

	/* Copy the (x,y,z,r,g,b) sixtuplet into GPU buffer */
	this.vbuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);
	gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);
	console.log("----------vertices-----------");
	console.log(vertices);
	let Idx = []
	for(let i = 0; i < vertices.length/6; i++){
	    Idx.push(i);
	}
	let idxBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint8Array.from(Idx), gl.STATIC_DRAW);
	this.indices = [];
	this.indices.push({"primitive": gl.POINTS, "buffer": idxBuffer, "numPoints": Idx.length});
    }



    /**
     * Draw the object
     * @param {Number} vertexAttr a handle to a vec3 attribute in the vertex shader for vertex xyz-position
     * @param {Number} colorAttr  a handle to a vec3 attribute in the vertex shader for vertex rgb-color
     * @param {Number} modelUniform a handle to a mat4 uniform in the shader for the coordinate frame of the model
     * @param {mat4} coordFrame a JS mat4 variable that holds the actual coordinate frame of the object
     */
    draw(vertexAttr, colorAttr, modelUniform, coordFrame) {
	/* copy the coordinate frame matrix to the uniform memory in shader */
	gl.uniformMatrix4fv(modelUniform, false, coordFrame);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);

	/* with the "packed layout"  (x,y,z,r,g,b),
	   the stride distance between one group to the next is 24 bytes */
	gl.vertexAttribPointer(vertexAttr, 3, gl.FLOAT, false, 24, 0); /* (x,y,z) begins at offset 0 */
	gl.vertexAttribPointer(colorAttr, 3, gl.FLOAT, false, 24, 12); /* (r,g,b) begins at offset 12 */

	for (let k = 0; k < this.indices.length; k++) {
	    let obj = this.indices[k];
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
	    gl.drawElements(obj.primitive, obj.numPoints, gl.UNSIGNED_BYTE, 0);
	}
    }
}
