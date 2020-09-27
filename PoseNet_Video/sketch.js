var keyPtsOfInterest = [0,5,6,7,8,9,10,11,12,13,14,15,16];
//                      0,1,2,3,4,5, 6, 7, 8, 9,10,11,12, 13hip, 14neck, 15head;
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

let writerNotDone = true;

function preload(){
  let writer;
}

function mouseClicked() {
  writerNotDone = false;
  writer.close();
  writer.clear();
}

function keyPressed() {
  // pressing any key starts the video and starts writing to a csv file
  if (value === 0) {
    writer = createWriter('arrays.csv');
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
  // frameRate(30);
  // load video of human movement
  video = createVideo('static/video.mp4');
  video.size(w, h);

  poseNet = ml5.poseNet(video);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
	});
  fill(255);
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

function distance(point1, point2){
  let dist = Math.sqrt((point2.x-point1.x)*(point2.x-point1.x)+(point2.y-point1.y)*(point2.y-point1.y));
  return dist;
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
      keyShape.push(midPoint(keyShape[7],keyShape[8]));
      //neck, midpoint of keypoints 5 and 6
      keyShape.push(midPoint(keyShape[1],keyShape[2]));
      //head is 1.5x the distance bewteen nose and neck
      let neck = keyShape[keyShape.length-1];
      // let halfHead = distance(neck,keyShape[0]);
      let head = {"x": 0, "y":0};
      head.x = neck.x + 1.5*(keyShape[0].x-neck.x);
      head.y = neck.y + 1.5*(keyShape[0].y-neck.y);
      keyShape.push(head);
      // console.log(keyShape)

      //draw circles showing detected parts
      for (let i = 0; i < keyShape.length; i++) {
        circle(keyShape[i].x, keyShape[i].y, 5);
      }

      //record positions into the csv file
      writer.print(`${keyShape[13].x},${keyShape[13].y},${keyShape[8].x},${keyShape[8].y},${keyShape[12].x},${keyShape[12].y},${keyShape[12].x},${keyShape[12].y},0,0,0,0,${keyShape[7].x},${keyShape[7].y},${keyShape[9].x},${keyShape[9].y},${keyShape[11].x},${keyShape[11].y},0,0,0,0,0,0,${keyShape[14].x},${keyShape[14].y},${keyShape[0].x},${keyShape[0].y},0,0,${keyShape[15].x},${keyShape[15].y},0,0,${keyShape[1].x},${keyShape[1].y},${keyShape[3].x},${keyShape[3].y},${keyShape[5].x},${keyShape[5].y},0,0,0,0,0,0,0,0,0,0,${keyShape[2].x},${keyShape[2].y},${keyShape[4].x},${keyShape[4].y},${keyShape[6].x},${keyShape[6].y},0,0,0,0,0,0,0,0`);
      // for (let i = 0; i < keyShape.length; i++) {
      //   writer.print(`v ${objRecordX} ${keyShape[i].x} ${video.height-keyShape[i].y}`);
      // }
      if(writerNotDone){
        console.log(`${frameCount} Recorded`);
      }

    }
    else{
      //if PoseNet has trouble detecting poses,
      //the frame where it can't is output to console
      //The corresponding image frames should be removed from 'Pose_3D/input_files/'
      console.log(frameCount);
    }

  }
}
