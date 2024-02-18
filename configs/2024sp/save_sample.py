import soundfile as sf
import os
import numpy as np
import json
import random

# ダミーと音量調整用
def cal_avepow_1s(wave, sr, thres):
    for i in range(len(wave) // sr):
        wave1s = wave[i * sr : (i + 1) * sr]
        Amp = np.abs(wave1s)
        Pow = np.mean(Amp**2)
        if Pow < thres:
            return False
    return True

thres = 0.0001
sr = 44100

with open("./metafile/jsons/{}.json".format("test_redux_133"), "r") as f:
    data_no = json.load(f)

sound = False
inst = "bass"
sample = data_no[0]
while sound == False:
    seg = random.randint(0, 100)
    path_i = "/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/{}/wave{}_{}.npz".format(inst, sample, seg)
    if os.path.exists(path_i):
        #print("exist")
        inst_wav_cut = np.load(path_i)["wave"]
        sound = cal_avepow_1s(inst_wav_cut, sr, thres)
        #print("sound", sound)
    else:
        pass
        #print("not exist")
os.makedirs("./resources/samples", exist_ok=True)
path_o = "./resources/samples/voleme_sample.wav"
inst_wav_cut_stereo = np.vstack((inst_wav_cut, inst_wav_cut))
sf.write(path_o, inst_wav_cut_stereo.T, sr)


sound = False
inst = "drums"
sample = data_no[1]
while sound == False:
    seg = random.randint(0, 100)
    path_i = "/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/{}/wave{}_{}.npz".format(inst, sample, seg)
    if os.path.exists(path_i):
        #print("exist")
        inst_wav_cut = np.load(path_i)["wave"]
        sound = cal_avepow_1s(inst_wav_cut, sr, thres)
        #print("sound", sound)
    else:
        pass
        #print("not exist")
os.makedirs("./resources/samples/samples", exist_ok=True)
path_o = "./resources/samples/dummyX1.wav"
inst_wav_cut_stereo = np.vstack((inst_wav_cut, inst_wav_cut))
sf.write(path_o, inst_wav_cut_stereo.T, sr)

sound = False
inst = "drums"
sample = data_no[2]
while sound == False:
    seg = random.randint(0, 100)
    path_i = "/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/{}/wave{}_{}.npz".format(inst, sample, seg)
    if os.path.exists(path_i):
        #print("exist")
        inst_wav_cut = np.load(path_i)["wave"]
        sound = cal_avepow_1s(inst_wav_cut, sr, thres)
        #print("sound", sound)
    else:
        pass
        #print("not exist")
os.makedirs("./resources/samples/samples", exist_ok=True)
path_o = "./resources/samples/dummyB1.wav"
inst_wav_cut_stereo = np.vstack((inst_wav_cut, inst_wav_cut))
sf.write(path_o, inst_wav_cut_stereo.T, sr)


sound = False
inst = "guitar"
sample = data_no[3]
while sound == False:
    seg = random.randint(0, 100)
    path_i = "/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/{}/wave{}_{}.npz".format(inst, sample, seg)
    if os.path.exists(path_i):
        #print("exist")
        inst_wav_cut = np.load(path_i)["wave"]
        sound = cal_avepow_1s(inst_wav_cut, sr, thres)
        #print("sound", sound)
    else:
        pass
        #print("not exist")
os.makedirs("./resources/samples/samples", exist_ok=True)
path_o = "./resources/samples/dummyX2.wav"
inst_wav_cut_stereo = np.vstack((inst_wav_cut, inst_wav_cut))
sf.write(path_o, inst_wav_cut_stereo.T, sr)

sound = False
inst = "guitar"
sample = data_no[4]
while sound == False:
    seg = random.randint(0, 100)
    path_i = "/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/{}/wave{}_{}.npz".format(inst, sample, seg)
    if os.path.exists(path_i):
        #print("exist")
        inst_wav_cut = np.load(path_i)["wave"]
        sound = cal_avepow_1s(inst_wav_cut, sr, thres)
        #print("sound", sound)
    else:
        pass
        #print("not exist")
os.makedirs("./resources/samples/samples", exist_ok=True)
path_o = "./resources/samples/dummyA2.wav"
inst_wav_cut_stereo = np.vstack((inst_wav_cut, inst_wav_cut))
sf.write(path_o, inst_wav_cut_stereo.T, sr)

