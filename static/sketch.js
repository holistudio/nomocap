var keyPtsOfInterest = [0,5,6,7,8,9,10,11,12,13,14,15,16];
let spacing = 10;
let drawFrame = 0;
let numDrawFrames = 10;

let video;
let poseNet;
let w = 640;
let h = 480;

let writer;
const objRecordRate = 5;
const objRecordSpacing = 50;
let objRecordX = 0;
let keyVertex = 1;

let poses = [];
let poseShapes = [];

let value = 0;

function preload(){
  let writer;
}

function mouseClicked() {
  writer.close();
  writer.clear();
}

function keyPressed() {
  if (value === 0) {
    writer = createWriter('array.csv');
    video.play();
    video.hide();
    value = 255;
  } else {
    value = 0;
  }
}

function gotPoses(estimatedPoses){
  poses = estimatedPoses;
}

function setup() {
  createCanvas(w, h);
  // frameRate(10);
  video = createVideo('static/nanquan4s.mp4');

  video.size(w, h);

  poseNet = ml5.poseNet(video);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
	});
  // video.play();
  // video.hide();

  fill(255);
  // var writer = createWriter('extract.obj');
}

function midPoint(point1, point2){
  let mid = {"x": 0, "y":0}
  mid.x = (point1.x + point2.x) / 2;
  mid.y = (point1.y + point2.y) / 2;
  return mid;
}

function slope(point1, point2){
  let sl = (point2.y - point1.y) / (point2.x - point1.x);

  return sl;
}

function draw() {

  background(0);
  image(video, 0, 0, video.width, video.height);

  if(poses.length>=1){
    //for each pose detected
    var pose = poses[0].pose;

    //record newest shape
    let keyShape=[];
    // let numVertices = 0;
    for(var j = 0; j < keyPtsOfInterest.length;j++){
      //each key point and position is stored in variables
      var keypoint = pose.keypoints[keyPtsOfInterest[j]];
      var position = keypoint.position;

      if (keypoint.score > 0.03){
        // if keypoint's score is significant, store it in keyShape
        // writer.print(`v ${drawFrame} ${position.x} ${position.y}`);
        // numVertices = numVertices+1;
        keyShape.push(position);
      }
    }




    if(keyShape.length == keyPtsOfInterest.length){

      //calculate hip, neck, and head points
      //hip, midpoint of keypoints 11 and 12
      keyShape.push(midPoint(keyShape[11],keyShape[12]));
      //neck, midpoint of keypoints 5 and 6
      keyShape.push(midPoint(keyShape[1],keyShape[2]));
      //head is double the distance bewteen nose and neck
      keyShape.push(keyShape[keyShape.length-1]+2*slope(keyShape[keyShape.length-1],keyShape[0]));

      //draw circles showing detected parts
      for (let i = 0; i < keyShape.length; i++) {
        circle(keyShape[i].x, keyShape[i].y, 5);
      }

      //record positions into the csv file
      // for (let i = 0; i < keyShape.length; i++) {
      //   writer.print(`v ${objRecordX} ${keyShape[i].x} ${video.height-keyShape[i].y}`);
      // }
    }
    else{
      console.log(frameCount);
    }


    // if(frameCount % objRecordRate == 0){
    //   //if keyShape has more than 2 positions
    //   if(keyShape.length>2){
    //     //record keyShape's positions
    //     for (let i = 0; i < keyShape.length; i++) {
    //       writer.print(`v ${objRecordX} ${keyShape[i].x} ${video.height-keyShape[i].y}`);
    //     }
    //     //vt vn and f lines according to keyShape's length
    //     //vn 1 0 0 for every vertex
    //     //vt 1 1 for every vertex
    //     for (let i = 0; i < keyShape.length; i++) {
    //       writer.print(`vt 1 1`);
    //     }
    //     for (let i = 0; i < keyShape.length; i++) {
    //       writer.print(`vn 1 0 0`);
    //     }
    //     let n = keyVertex;
    //     //number of faces equals number of vertices -2 (keyShape's length - 2)
    //     for (let i = 0; i < keyShape.length-2; i++) {
    //       writer.print(`f ${n+1}/${n+1}/${n+1} ${n+2}/${n+2}/${n+2} ${keyVertex}/${keyVertex}/${keyVertex}`);
    //       n++;
    //     }
    //     keyVertex+= keyShape.length;
    //   }
    //   //always increment objRecordX by objRecordSpacing (so blank/invalid shapes will lead to blanks in the obj record)
    //   objRecordX = objRecordX + objRecordSpacing;
    //
    // }

    // //if poseShapes length is less than numDrawFrames
    // if(poseShapes.length<numDrawFrames){
    //   //add shape to end of array, as an array of positions
    //   poseShapes.push(keyShape);
    // }
    //
    // //if the shapeArray length is numDrawFrames, draw all shapes
    // if(poseShapes.length == numDrawFrames){
    //
    //   let shade = 0.1;
    //
    //   for (let k = 0; k<poseShapes.length; k++){
    //     stroke(`rgba(255,255,255,${shade})`);
    //     beginShape();
    //     for (let l = 0; l<poseShapes[k].length; l++){
    //       vertex(poseShapes[k][l].x-(numDrawFrames*spacing), poseShapes[k][l].y);
    //
    //     }
    //     endShape(CLOSE);
    //     translate(spacing,0);
    //     shade+= 0.2;
    //   }
    //
    //   //remove shapeArray's first element (oldest)
    //   poseShapes.splice(0, 1);
    // }
  }
}
