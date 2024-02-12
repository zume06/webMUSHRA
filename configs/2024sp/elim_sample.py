import numpy as np
import soundfile as sf
import json
import random
import argparse
import os


def rand_elims(lst, elims):
    r = random.choice(lst)
    while r in elims:
        r = random.choice(lst)
    return r


def cal_avepow_1s(wave, sr, thres):
    for i in range(len(wave) // sr):
        wave1s = wave[i * sr : (i + 1) * sr]
        Amp = np.abs(wave1s)
        Pow = np.mean(Amp**2)
        if Pow < thres:
            return False
    return True

fname_dataname_in = "test_redux_136"
fname_dataname_out = "test_redux_subeva"

with open("./metafile/jsons/{}.json".format(fname_dataname_in), "r") as f:
    data_no = json.load(f)
    
thres = 0.0001
sr = 44100

for sample in data_no:
    for inst in ["drums", "bass", "piano", "guitar", "residuals"]:
        print(inst, sample)
        count = 0
        sound = False
        while sound == False:
            seg = random.randint(0, 100)
            if count > 100:
                if sample in data_no:
                    data_no.remove(sample)
                    print("break")
                break
            path_i = "/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/{}/wave{}_{}.npz".format(inst, sample, seg)
            if os.path.exists(path_i):
                #print("exist")
                inst_wav_cut = np.load(path_i)["wave"]
                sound = cal_avepow_1s(inst_wav_cut, sr, thres)
                #print("sound", sound)
                count = count + 1
            else:
                pass
                #print("not exist")
        seg1 = seg
        sound = False
        count = 0
        while sound == False:
            seg = rand_elims(np.arange(0,100),[seg1])
            if count > 100:
                if sample in data_no:
                    data_no.remove(sample)
                    print("break")
                break
            path_i = "/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/{}/wave{}_{}.npz".format(inst, sample, seg)
            if os.path.exists(path_i):
                #print("exist")
                inst_wav_cut = np.load(path_i)["wave"]
                sound = cal_avepow_1s(inst_wav_cut, sr, thres)
                #print("sound", sound)
                count = count + 1
            else:
                pass
                #print("not exist")
                
with open("./metafile/jsons/{}.json".format(fname_dataname_out), "w") as f:
    json.dump(data_no, f, indent=4)
    