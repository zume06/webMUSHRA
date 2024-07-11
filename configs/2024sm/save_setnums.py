import numpy as np
import os

testID = "inst_sim_abx_2024sp"
"""
for iter in range(5):
    if iter == 0:
        arrays = np.arange(0,80)
    else:
        array = np.arange(0,80)
        arrays = np.concatenate((arrays, array))
"""        
arrays = np.arange(0,300)

arrays = arrays.astype(int)
os.makedirs("./setnums/{}/".format(testID), exist_ok=True)
np.savetxt('./setnums/{}/setnums.csv'.format(testID), arrays, delimiter=',', fmt='%d')
