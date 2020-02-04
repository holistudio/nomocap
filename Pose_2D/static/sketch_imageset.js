var keyPtsOfInterest = [0,5,6,7,8,9,10,11,12,13,14,15,16];
//                      0,1,2,3,4,5, 6, 7, 8, 9,10,11,12, 13hip, 14neck, 15head;
let imgNum = 0;
let numImages = 28;

let poseNet;
let w = 640;
let h = 480;

let writer;

let poses = [];
let poseShapes = [];

let writerNotDone = true;

function preload(){
  let writer;
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

// when poseNet is ready, do the detection
function modelReady() {
    // When the model is ready, run the singlePose() function...
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results
    // in the draw() loop, if there are any poses, then carry out the draw commands
    poseNet.singlePose(img)
}
function imageReady(){
    // set some options
    let options = {
        imageScaleFactor: 1,
        minConfidence: 0.1
    }

    // assign poseNet
    poseNet = ml5.poseNet(modelReady, options);

    // This sets up an event that listens to 'pose' events
    poseNet.on('pose', function (results) {
        poses = results;
    });
}

function setup() {
  writer = createWriter('arrays.csv');
  //count number of jpg images in image_set folder


  createCanvas(w, h);
  img = createImg(`static/image_set/changquan3s00.jpg`, imageReady);
  img.size(width, height);
  img.hide();
  // console.log(img)
  frameRate(1);

}

function draw() {

  background(0);
  if(imgNum<10){
    img.elt.src=`static/image_set/changquan3s0${imgNum}.jpg`;
  }
  else{
    img.elt.src=`static/image_set/changquan3s${imgNum}.jpg`;
  }
  //for each image in image_set folder
  image(img, 0, 0, width, height);

  //poseNet analyzes the image
  if(poses.length>=1){
    //for first pose detected
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
  if(imgNum<numImages){
    imgNum++;

  }
  else{
    writerNotDone = false;
    writer.close();
    writer.clear();
    noLoop();
  }
}
