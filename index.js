const Jimp = require('jimp');

class Point{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Node{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.pointList = [];
    this.deltaDist = 0;
  }

  cleanPointList(){
    this.pointList = [];
  }
}

async function readImage(){
  let pixelArray = [];
  const image = await Jimp.read('./AB2.bmp');
  for(let i=0; i<image.bitmap.width; i++){
    for(let j=0; j<image.bitmap.height; j++){
      let color = Jimp.intToRGBA(image.getPixelColor(i,j));
      let tempPoint = new Point(color.r,color.g,color.b);
      pixelArray.push(tempPoint);
    }
  }
  return {width: image.bitmap.width, height: image.bitmap.height, pixelArray: pixelArray};
};

function caldist(a, b) {
  // pythagore goes brrr
  // return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z -a.z) ** 2);
  return (b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z -a.z) ** 2;
}

// determine the number of différent color in the export
let nbrOfNode = 3;

// sys var, do not toutch
let nodeList = [];
let pointList = [];
let step = 0;
let stop = false;

async function main(){
  
  let image = await readImage();

  // Pixel array
  pointList = image.pixelArray;

  // Node array
  for(let i=0; i<nbrOfNode; i++){
    let tempX = Math.floor(Math.random()*255);
    let tempY = Math.floor(Math.random()*255);
    let tempZ = Math.floor(Math.random()*255);
    let tempNode = new Node(tempX,tempY,tempZ);
    nodeList.push(tempNode);
  }


  while(!stop && step<100000000){
    // console.log(step);
    if(step%100000 == 0){
      console.log(step/100000 + '%');
    }
    // Cleaning links
    nodeList.forEach(node => node.cleanPointList());
  
    // Assigns point to nearest node
    for(let i=0; i<pointList.length; i++){
      let minDist = image.height * image.width;
      let minDistNodeIndex = 0;
      for(let j=0; j<nodeList.length; j++){
        let tempDist = caldist(pointList[i],nodeList[j]);
        if(minDist > tempDist){
          minDist = tempDist;
          minDistNodeIndex = j;
        }
      }
      nodeList[minDistNodeIndex].pointList.push(i)
    }
  
    let stop = true;
    let nodeFinished = 0;
    nodeList.forEach(node =>{
      let tempX = 0;
      let tempY = 0;
      let tempZ = 0;
      node.pointList.forEach(e => {
        tempX += pointList[e].x;
        tempY += pointList[e].y;
        tempZ += pointList[e].z;
      });
      if(node.pointList.length !=0){
        tempX /= node.pointList.length;
        tempY /= node.pointList.length;
        tempZ /= node.pointList.length;
        let tempPoint = new Point(tempX,tempY,tempZ);
        let dist = caldist(tempPoint,node); 
        if(dist>1){
          stop = false;
        } else {
          nodeFinished ++;
        }
        node.x = Math.floor(tempX);
        node.y = Math.floor(tempY);
        node.z = Math.floor(tempZ);
        node.deltaDist = dist;
      }
    });
    // console.log('node potentialy finished : ' + nodeFinished);
    step ++;
  }

  nodeList.forEach(node => console.log(node.x + ' ' + node.y + ' ' + node.z));
  nodeList.forEach(node => console.log('delta dist : ' + node.deltaDist));

  console.log('finished in ' + step + ' steps.');

}

main();