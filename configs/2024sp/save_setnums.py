import numpy as np
import os

testID = "mini-test_0212"
for iter in range(5):
    if iter == 0:
        arrays = np.arange(0,80)
    else:
        array = np.arange(0,80)
        arrays = np.concatenate((arrays, array))

arrays = arrays.astype(int)
os.makedirs("./setnums/{}/".format(testID), exist_ok=True)
np.savetxt('./setnums/{}/setnums.csv'.format(testID), arrays, delimiter=',', fmt='%d')
