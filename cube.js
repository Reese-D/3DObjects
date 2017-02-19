/*
 * Created by Reese & Miles Dewind 01/10/2017
 */


lineFunc(subDiv, end){
  let line = [][];
  for(i=0; i <= subDiv; i++){
    // line{point][x,y,z]
    line[i][0] = 0
    line[i][1] = end/subDiv * i;
    line[i][2] = 0;
  }
  return line;
}

void pointFunc(subDiv, line, special){
  // note special = and array of size 2 where the first value is a radius
  // and the second value is a persentage of that radius
  

  //circles[point][x,y,z]
  let circles = [][];
  for(index=0; index < line.length; index++){
    for(i=0; i <= subDiv; i++){
    radius = special[0];
    shrink  = radius * index * (special[1] / line.length);

    //create the points in the circle for circles
    //format: xValues[i] = (centerX + radius * 
    //Math.cos(2 * Math.PI * i/ steps-Math.Pi)
    circles[i][0] = (line[index][0] + radius - shrink) *
      Math.cos(2 * Math.PI * i / subDiv)); 
    circles[i][1] = (line[index][1] + radius  - shrink) *
      Math.sin(2 * Math.Pi * i / subDiv));
    circles[i][2] =  line[index][2];
    }
  }
  return circles;
}
