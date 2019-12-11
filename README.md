# nomocap
 "motion capture" in the wild

Based on rayat137's Pose_3D code https://github.com/rayat137/Pose_3D

Based on reported issues in the original repository, several changes were made to the Pose_3D code, namely the following files:

```
cameras.py
data_util.py
viz.py
```

These changes can be found in each of those file anywhere there is a 'CHANGED:' comment.

**BUT WAIT THERE'S MORE!**

Two folders are excluded from this public repository, due to the large size of their files:
```
Pose_3D/h36m/
Pose_3D/trained_model/
```
These two folders need to be created and filled with the following data:

`h36m` contains the Human3.6 baseline 3D pose data, which can be downloaded with wget:
```
wget https://www.dropbox.com/s/e35qv3n6zlkouki/h36m.zip
```
(wget can be installed for Windows through this link: https://sourceforge.net/projects/gnuwin32/files/wget/1.11.4-1/wget-1.11.4-1-setup.exe/download?use_mirror=excellmedia)

`trained_model` folder contains the trained model

 0. Create the trained_model folder within Pose_3D directory
 1. Download the tar file: https://drive.google.com/file/d/1j2jpwDpfj5NNx8n1DVqCIAESNTDZ2BDf/view?usp=sharing
 2. Create the following folders within trained_model (yes all of them): `Pose_3D/temporal_3d_release/trained_model/All/dropout_0.5/epochs_100/adam/lr_1e-05/linear_size1024/batch_size_32/use_stacked_hourglass/seqlen_5/`
 3. Untar the downloaded file and move them to the above filepath.

# Dependencies

First it's recommended to use Anaconda or some other virtual environment. Once the virtual environment is activated, use pip to install the requirements.txt file:
```
pip install -r requirements.txt
```

Note the versions of tensorflow and opencv-python/opencv-contrib-python. The version numbers for those are **critical**.
