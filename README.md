# nomocap

 *"motion capture" in the wild*

The primary purpose of this code is to use 3D human pose estimation deep learning models and 2D direct linear transformation to generate a 3D representation of a wushu performance on a standard wushu competition carpet. Essentially, doing what motion capture systems do with suites of cameras, sensors, and suits...but with only a single video. Hence the project name, "nomocap" = No More Motion Capture!

Currently based on rayat137's [Pose_3D](https://github.com/rayat137/Pose_3D) code (see References for details on changes). Of course, a number of other 3D human pose estimation methods/scripts are [out there](https://paperswithcode.com/task/3d-human-pose-estimation).

Diagram of the current pipeline:

<img src="img/pipeline-01.png" width="500" />

## Getting Started

### Dependencies

First it's recommended to use Anaconda or some other virtual environment. Once the virtual environment is activated, use pip to install the requirements.txt file:
```
pip install -r requirements.txt
```

Note the versions of tensorflow, opencv-python, and opencv-contrib-python. The version numbers for those are **critical**.

### Training Data and Model

Two folders containing the training data and pre-trained model are excluded from this public repository, due to the large size of their files:
```
Pose_3D/h36m/
Pose_3D/trained_model/
```
These two folders need to be created and filled with the following data:

The `h36m` folder contains the Human3.6 baseline 3D pose data, which can be downloaded with wget:
```
wget https://www.dropbox.com/s/e35qv3n6zlkouki/h36m.zip
```
(wget can be installed for Windows through this link: https://sourceforge.net/projects/gnuwin32/files/wget/1.11.4-1/wget-1.11.4-1-setup.exe/download?use_mirror=excellmedia)

The `trained_model` folder contains the trained model

 0. Create the trained_model folder within Pose_3D directory
 1. Download the tar file: https://drive.google.com/file/d/1j2jpwDpfj5NNx8n1DVqCIAESNTDZ2BDf/view?usp=sharing
 2. Create the following folders within trained_model (yes all of them): `Pose_3D/temporal_3d_release/trained_model/All/dropout_0.5/epochs_100/adam/lr_1e-05/linear_size1024/batch_size_32/use_stacked_hourglass/seqlen_5/`
 3. Untar the downloaded file and move them to the above filepath.


### OK Now We're Ready!

Now that you have everything installed and downloaded, you need to do the following to get 3D pose estimates:

1. Get 2D pose estimate data from raw video saved as a `*.h5` file. More on this in the next section.
2. Get image frames of the video as jpg files. This can be done using Premiere to export the raw video as jpg files for frames at the same framerate as your 2D pose estimate data (likely ~30fps). Other methods may be available online if you don't have Premiere.
3. Save files from both steps into `Pose_3D/input_files`
4. In terminal, set current directory as `Pose_3D` run the `create_movie.py` script (`python create_movie.py`). If you are using a virtual environment, of course, make sure it's activated.
5. Results will be in `Pose_3D/output_results`, including a sequence of images showing the 3D pose results and a csv file of X,Y,Z coordinates of pose joint estimates (`vertices.csv`).
6. The `vertices.csv` can be used to generate 3D animations of the 3D pose estimate. A example code of how to do this with OpenGL is in the `Pose_3DView` folder.

### Pose_2D - Getting 2D Pose Estimates

Hossain and Little used a stacked-hourglass detector to get 2D pose estimates prior to running their 3D pose estimation script. In their code example, these 2D estimates are saved to an h5 file (`Pose_3D/fed/preds.h5`).

I was more familiar with using PoseNet for 2D pose estimates so I wrote some scripts to convert PoseNet estimates to the Human3.6M dataset standard (`Pose_2D` folder).

For reference, below is a "conversion chart" for Human3.6M's and PoseNet's pose joint indices.

<img src="img/PoseNetvsPose3D-01.png" width="500"/>

RUN_POSENET_INSTRUCTIONS
Save the `array.csv` file to the `Pose_3D/input_files/` folder. Inside that folder there should already be a script, `h5converter.py`, to take the csv file and generate the h5 file needed for the 3D pose estimates.

### Pose_3DView

## References

The Pose_3D code is slightly modified from code referenced in Hossain and Little's paper:
https://github.com/rayat137/Pose_3D
Based on reported issues in the original repository, several changes were made to the Pose_3D code, namely the following files:

```
cameras.py
data_util.py
viz.py
```
These changes can be found in each of those file anywhere there is a 'CHANGED:' comment.

Instructions for getting training data based on:
https://github.com/una-dinosauria/human-motion-prediction

PoseNet:
https://ml5js.org/reference/api-PoseNet/

Da Vinci's Vitruvian Man from Wikipedia https://en.wikipedia.org/wiki/Vitruvian_Man#/media/File:Da_Vinci_Vitruve_Luc_Viatour.jpg
