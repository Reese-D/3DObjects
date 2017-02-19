/*
 * Created by Reese & Miles Dewind 01/10/2017
 */


lineFunc(subDiv, end, x, y, z)
  let line = [][];
  for(i=0; i <= subDiv; i++){
    // line{point][x,y,z] 
    line[i][0] = end/subDiv * (i * x);
    line[i][1] = end/subDiv * (i * y);
    line[i][2] = end/subDiv * (i * z);
  }
  return line;
}

void pointFunc(subDiv, line, special){
  // note special = and array of size 2 where the first value is the
  // radius of the internal cone, and the second value is the radius
  // of the external cone.
  

  //circles[circle number][circle points][x,y,z]
  let circles = [][][];
  for(index=0; index < 4; index++){
    for(i=0; i <= subDiv; i++){
      innerRadius = special[0];
      outerRadius = special[1];

      //create the points in the circle for circles
      //format: xValues[i] = (centerX + radius * 
      //Math.cos(2 * Math.PI * i/ steps-Math.Pi)
      if(index % 3 == 0){
        circles[index][index + i][0] = (line[index][0] + innerRadius) *
          Math.cos(2 * Math.PI * i / subDiv)); 
        circles[index][index + i][1] = (line[index][1] + innerRadius) *
          Math.sin(2 * Math.Pi * i / subDiv));
        circles[index][index + i][2] =  line[index][2];
      }else{
        circles[index][index + i][0] = (line[index][0] + outerRadius) *
          Math.cos(2 * Math.PI * i / subDiv)); 
        circles[index][index + i][1] = (line[index][1] + outerRadius) *
          Math.sin(2 * Math.Pi * i / subDiv));
        circles[index][index + i][2] =  line[index][2];

      }
    }
  }
  return circles;
}
