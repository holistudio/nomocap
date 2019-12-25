import csv
import numpy as np
import h5py

with open('arrays.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quoting=csv.QUOTE_NONNUMERIC)
    row_count = sum(1 for row in reader)
    with h5py.File("preds.h5", "w") as f:
        dset = f.create_dataset("enc_in", (row_count,64), dtype='<f8')
        i=0;
        for row in reader:
            row = np.array(row);
            dset[i] = row;
            i=i+1;
