import csv
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import pylab
from mpl_toolkits.mplot3d import proj3d

fig = pylab.figure()
ax = fig.add_subplot(111, projection='3d')

point_x=[];
point_y=[];
point_z=[];

points=np.array([0,1,2,3,6,7,8,13,14,15,17,18,19,25,26,27]);

with open('pose0.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quoting=csv.QUOTE_NONNUMERIC);
    i=0
    for row in reader:
        if(points.tolist().count(i)!=0):
            row = np.array(row);
            point_x.append(row[0]);
            point_y.append(row[1]);
            point_z.append(row[2]);
        i=i+1;

ax.scatter(point_x, point_y, point_z , alpha=1.0);
# for i in range(0,len(point_x)):
#     ax.annotate(i, (point_x[i], point_y[i], point_z[i]))

# plt.show();

# now try to get the display coordinates of the first point
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_zlabel('z')
r = 750;
xroot, yroot, zroot = point_x[0], point_y[0], point_z[0]
ax.set_xlim3d([-r+xroot, r+xroot])
ax.set_zlim3d([-r+zroot, r+zroot])
ax.set_ylim3d([-r+yroot, r+yroot])

j = 0;
x2, y2, _ = proj3d.proj_transform(point_x[j],point_y[j],point_z[j], ax.get_proj())

label = pylab.annotate(
    str(j),
    xy = (x2, y2), xytext = (-20, 20),
    textcoords = 'offset points', ha = 'right', va = 'bottom',
    bbox = dict(boxstyle = 'round,pad=0.5', fc = 'yellow', alpha = 0.5),
    arrowprops = dict(arrowstyle = '->', connectionstyle = 'arc3,rad=0'))

def update_position(e):
    x2, y2, _ = proj3d.proj_transform(point_x[j],point_y[j],point_z[j], ax.get_proj())
    label.xy = x2,y2
    label.update_positions(fig.canvas.renderer)
    fig.canvas.draw()
fig.canvas.mpl_connect('button_release_event', update_position)



pylab.show()
