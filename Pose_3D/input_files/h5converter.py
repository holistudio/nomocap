import csv
import numpy as np
import h5py
import pandas as pd

with open('arrays.csv', newline='') as csvfile:
    row_count = sum(1 for row in csvfile);
with open('arrays.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quoting=csv.QUOTE_NONNUMERIC)
    with h5py.File("preds.h5", "w") as f:
        dset = f.create_dataset("enc_in", (row_count,64), dtype='<f8')
        i=0;
        for row in reader:
            dset[i] = np.array(row).astype(np.float);
            i=i+1;
            print(i);
