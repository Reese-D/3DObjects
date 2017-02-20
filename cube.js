/*
 * Created by Miles Dewind 01/10/2017
 */

function cubePointFunc(subDiv, line, special){
  // note special = and array of size 2 where the first value is a radius
  // and the second value the number of subdivisions on our cube
   

  //circles[circle number][circle points][x,y,z]
  let cubeHolder = [];
  let cube = [];
  let radius = special[0];
  for(index=0; index < 2; index++){
    console.log(line);
    let circlePoints = [];
    for(i=0; i < 4; i++){
      let xyz = [];
      //create the points in the circle for circles
      //format: xValues[i] = (centerX + radius * 
      //Math.cos(2 * Math.PI * i/ steps-Math.Pi)
      xyz[0] = (line[index][0] + radius) *
        Math.cos(2 * Math.PI * i / 4); 
      xyz[1] = (line[index][1] + radius) *
        Math.sin(2 * Math.PI * i / 4);
      xyz[2] =  line[index][2];
      circlePoints.push(xyz);
    }
    cubeHolder.push(circlePoints);
    console.log(cubeHolder);
//    console.log(line);
  }
  //let split = special[1];

  //note: positive y and x values minus negative y and x values
  //finds the distance between these points on x any y axis
 // let yaug = (cubeHolder[0][0][1] - cubeHolder[0][3][1]) /split;
 // let xaug = (cubeHolder[0][0][0] - cubeHolder[0][2][0]) /split;
  //for(i=0; i < split; i++){
    
 // }
    
  
  return cubeHolder;
}
