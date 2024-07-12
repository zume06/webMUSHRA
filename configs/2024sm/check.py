import os
import json
import soundfile as sf

with open("./sample_list/dict_triplet.json", "r") as f:
    sample_dict = json.load(f)

for setnum in sample_dict:
    for tripletnum in sample_dict[setnum]:
        for testnum in sample_dict[setnum][tripletnum]:
            for inst in sample_dict[setnum][tripletnum][testnum]:
                for sample in sample_dict[setnum][tripletnum][testnum][inst]:
                    filename = sample_dict[setnum][tripletnum][testnum][inst][sample]["filename"]
                    path = "./resources/set{}/{}/{}/{}".format(setnum, inst, tripletnum, filename)
                    #if os.path.exists(path) == False:
                    #    print("no exist")
                    wave, sr = sf.read(path)
                    print(len(wave)/sr)