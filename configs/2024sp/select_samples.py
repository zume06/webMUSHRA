import numpy as np
import soundfile as sf
import json
import random
import argparse
import os
import shutil


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

def main():
    parser = argparse.ArgumentParser(description="select original file")
    parser.add_argument("--s", type=int, help="number of sets")
    parser.add_argument("--t", type=int, help="number of triplets per test per set")
    parser.add_argument("--f", help="file name of test data")
    parser.add_argument("--l", type=int, help="length of sample[s]")
    args = parser.parse_args()
    
    n_sets = args.s
    n_trip = args.t
    fname_dataname = args.f
    thres = 0.0001
    length = args.l
    overlap = 0
    
    sr = 44100
    win_len = 2048  # STFTの窓幅
    one_seg_len = int((sr * length // win_len) * win_len)  # STFTするときに窓が収まるように
    hop_size = int(one_seg_len * (1 - overlap))  # この分割におけるオンセット
    
    # track which does not have fit segment is eliminated
    with open("./metafile/jsons/{}.json".format(fname_dataname), "r") as f:
        data_no = json.load(f)
    
    if os.path.exists("./resources"):
        shutil.rmtree("./resources")
    

    dict_triplet = {}
    k = 0
    while k < n_sets:
        print("set-", k)
        dict_triplet[k] = {}
        l = 0
        while l < n_trip:
            dict_triplet[k][l] = {}
            # select X; same in test1 and test2
            X = random.choice(data_no)
            seg_X = {}
            for test in [1, 2]:
                dict_triplet[k][l]["test{}".format(test)]={}
                print("test-", test)
                if test == 1:
                    # test1; Y is same as X
                    Y = X
                    C = rand_elims(data_no, [X])
                    print("X, Y, C:", X, Y, C)
                    track = ["X", "Y", "C"]
                    trackID = [X, Y, C]
                    
                elif test == 2:
                    # test2; X, A, B are all different
                    A = rand_elims(data_no, [X])
                    B = rand_elims(data_no, [X, A])
                    print("X, A, B:", X, A, B)
                    track = ["X", "A", "B"]
                    trackID = [X, A, B]
                    
                for inst in ["drums", "bass", "piano", "guitar", "residuals"]:
                    dict_triplet[k][l]["test{}".format(test)][inst]={}
                    for i, sample in enumerate(trackID):
                        print("set{}-{}, test{}, {}, {}, {}".format(k, l, test, inst, track[i], sample))
                        dict_triplet[k][l]["test{}".format(test)][inst][track[i]]={}
                        sound = False
                        while sound == False:
                            if track[i] == "Y":
                                seg = rand_elims(np.arange(0,100),[seg_X[inst]])
                            elif track[i] == "X" and test == 2:
                                seg = seg_X[inst]
                                #print(seg)
                            else:
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
                        if track[i] == "X" and test == 1:
                            #print(seg)
                            seg_X[inst] = seg
                        os.makedirs("./resources/set{}/{}/{}/".format(k, inst, l), exist_ok=True)
                        path_o = "./resources/set{}/{}/{}/{}_{}-{}.wav".format(k, inst, l, track[i], X, seg)
                        sf.write(path_o, inst_wav_cut, sr)
                        dict_triplet[k][l]["test{}".format(test)][inst][track[i]]["ID"] = int(sample)
                        dict_triplet[k][l]["test{}".format(test)][inst][track[i]]["seg"] = int(seg)
                        dict_triplet[k][l]["test{}".format(test)][inst][track[i]]["sr"] = int(sr)
                        dict_triplet[k][l]["test{}".format(test)][inst][track[i]]["index_s"] = int(seg * hop_size)
                        dict_triplet[k][l]["test{}".format(test)][inst][track[i]]["index_t"] = int(seg * hop_size + one_seg_len)
            l = l + 1
                            
                        
        k = k + 1
        
    print(dict_triplet)
    
    with open("./sample_list/dict_triplet.json", "w") as f:
        json.dump(dict_triplet, f, indent=4)
    

if __name__ == "__main__":
    main()