import json
import numpy as np
import re

dict_path = "./sample_list/dict_triplet_wrongindex.json"

with open(dict_path, 'r') as file:
    data = json.load(file)
    
dict_triplet = {}
    
for i in data:
    dict_triplet[i]={}
    for j in data[i]:
        dict_triplet[i][j]={}
        for k in data[i][j]:
            dict_triplet[i][j][k]={}
            for l in data[i][j][k]:
                dict_triplet[i][j][k][l]={}
                for m in data[i][j][k][l]:
                    dict_triplet[i][j][k][l][m]={}
                    filename = re.sub(".wav", ".npz", data[i][j][k][l][m]["filename"])
                    filename = re.sub("X_", "wave", filename)
                    filename = re.sub("A_", "wave", filename)
                    filename = re.sub("B_", "wave", filename)
                    filename = re.sub("Y_", "wave", filename)
                    filename = re.sub("C_", "wave", filename)
                    filename = re.sub("-", "_", filename)
                    npz = np.load("/home/hashizume/nas03/assets/Dataset/slakh/cutwave/5s_on5.0/{}/{}".format(l, filename))
                    #print(data[i][j][k][l][m]["index_s"])
                    #print(npz["index_s"])
                    dict_triplet[i][j][k][l][m]["ID"]=data[i][j][k][l][m]["ID"]
                    dict_triplet[i][j][k][l][m]["seg"]=data[i][j][k][l][m]["seg"]
                    dict_triplet[i][j][k][l][m]["filename"]=data[i][j][k][l][m]["filename"]
                    dict_triplet[i][j][k][l][m]["sr"]=data[i][j][k][l][m]["sr"]
                    dict_triplet[i][j][k][l][m]["index_s"]=npz["index_s"].item()
                    dict_triplet[i][j][k][l][m]["index_e"]=npz["index_e"].item()

print(dict_triplet)                        
with open("./sample_list/dict_triplet.json", "w") as f:
    json.dump(dict_triplet, f, indent=4)