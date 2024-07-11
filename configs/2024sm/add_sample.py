import soundfile as sf
import os
import numpy as np
import json
import random

# 混合音を追加

def cal_avepow_1s(wave, sr, thres):
    for i in range(len(wave) // sr):
        wave1s = wave[i * sr : (i + 1) * sr]
        Amp = np.abs(wave1s)
        Pow = np.mean(Amp**2)
        if Pow < thres:
            return False
    return True

def write_dict(sample_dict, name, track, elim_segs, thres=0.0001):
    sound = False
    while(sound == False):
        seg = random.randint(0, 100)
        if seg in elim_segs:
            continue
        path = "/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/mix/wave{}_{}.npz".format(track, seg)
        if os.path.exists(path) == False:
            continue
        npz = np.load(path)
        inst_wav_cut = npz["wave"]
        sound = cal_avepow_1s(inst_wav_cut, sr, thres)
        index_s = int(npz["index_s"])
        index_e = int(npz["index_e"])
    sample_dict[setnum][tripletnum][testnum]["mix"][name]={}
    sample_dict[setnum][tripletnum][testnum]["mix"][name]["ID"] = track
    sample_dict[setnum][tripletnum][testnum]["mix"][name]["seg"] = seg
    sample_dict[setnum][tripletnum][testnum]["mix"][name]["filename"] = "{}_{}-{}.wav".format(name, track, seg)
    sample_dict[setnum][tripletnum][testnum]["mix"][name]["sr"] = 44100
    sample_dict[setnum][tripletnum][testnum]["mix"][name]["index_s"] = index_s
    sample_dict[setnum][tripletnum][testnum]["mix"][name]["index_e"] = index_e
    
    return sample_dict, inst_wav_cut, seg
    
def save_audio(inst_wav_cut, setnum, tripletnum, name, track, seg, sr=44100):
    os.makedirs("./resources/set{}/mix/{}/".format(setnum, tripletnum), exist_ok=True)
    path_o = "./resources/set{}/mix/{}/{}_{}-{}.wav".format(setnum, tripletnum, name, track, seg)
    inst_wav_cut_stereo = np.vstack((inst_wav_cut, inst_wav_cut))
    sf.write(path_o, inst_wav_cut_stereo.T, sr)

thres = 0.0001
sr = 44100

with open("./sample_list/dict_triplet_onlyinst.json", "r") as f:
    sample_dict = json.load(f)

for setnum in sample_dict:
    for tripletnum in sample_dict[setnum]:
        for testnum in sample_dict[setnum][tripletnum]:
            segs_x = []
            segs_y = []
            segs_c = []
            segs_a = []
            segs_b = []
            for inst in sample_dict[setnum][tripletnum][testnum]:
                for sample in sample_dict[setnum][tripletnum][testnum][inst]:
                    if sample == "X":
                        segs_x.append(sample_dict[setnum][tripletnum][testnum][inst][sample]["seg"])
                        track_x = sample_dict[setnum][tripletnum][testnum][inst][sample]["ID"]
                    elif sample == "Y":
                        segs_y.append(sample_dict[setnum][tripletnum][testnum][inst][sample]["seg"])
                        track_y = sample_dict[setnum][tripletnum][testnum][inst][sample]["ID"]
                    elif sample == "C":
                        segs_c.append(sample_dict[setnum][tripletnum][testnum][inst][sample]["seg"])
                        track_c = sample_dict[setnum][tripletnum][testnum][inst][sample]["ID"]
                    elif sample == "A":
                        segs_a.append(sample_dict[setnum][tripletnum][testnum][inst][sample]["seg"])
                        track_a = sample_dict[setnum][tripletnum][testnum][inst][sample]["ID"]
                    elif sample == "B":
                        segs_b.append(sample_dict[setnum][tripletnum][testnum][inst][sample]["seg"])
                        track_b = sample_dict[setnum][tripletnum][testnum][inst][sample]["ID"]
            sample_dict[setnum][tripletnum][testnum]["mix"] = {}
            # for X
            sample_dict, inst_wav_cut_x, seg_x = write_dict(sample_dict, "X", track_x, segs_x)
            save_audio(inst_wav_cut_x, setnum, tripletnum, "X", track_x, seg_x)
            if testnum == "test1":
                # for Y
                sample_dict, inst_wav_cut_y, seg_y = write_dict(sample_dict, "Y", track_y, segs_y)
                save_audio(inst_wav_cut_y, setnum, tripletnum, "Y", track_y, seg_y)
                # for C
                sample_dict, inst_wav_cut_c, seg_c = write_dict(sample_dict, "C", track_c, segs_c)
                save_audio(inst_wav_cut_c, setnum, tripletnum, "C", track_c, seg_c)
            elif testnum == "test2":
                # for A
                sample_dict, inst_wav_cut_a, seg_a = write_dict(sample_dict, "A", track_a, segs_a)
                save_audio(inst_wav_cut_a, setnum, tripletnum, "A", track_a, seg_a)
                # for B
                sample_dict, inst_wav_cut_b, seg_b = write_dict(sample_dict, "B", track_b, segs_b)
                save_audio(inst_wav_cut_b, setnum, tripletnum, "B", track_b, seg_b)
      
with open("./sample_list/dict_triplet.json", "w") as f:
    json.dump(sample_dict, f, indent=4)