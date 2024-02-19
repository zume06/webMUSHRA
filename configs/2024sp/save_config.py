import json
import yaml
import random
from collections import OrderedDict
import os


with open("./sample_list/dict_triplet.json", "r") as f:
    dict_triplet = json.load(f)
    
testname = "test_20240219"
setnum = 10
tripletnum = 4
references = {}
samplesA = {}
samplesB = {}

for k in range(setnum):
    count = 1
    for l in range(tripletnum):
        for test in [1, 2]:
            for inst in ["drums", "bass", "piano", "guitar", "residuals"]:
                X = dict_triplet[str(k)][str(l)]["test{}".format(test)][inst]["X"]["filename"]
                if test == 1:
                    param = random.choice([0, 1])
                    if param == 0:
                        A = dict_triplet[str(k)][str(l)]["test{}".format(test)][inst]["Y"]["filename"]
                        B = dict_triplet[str(k)][str(l)]["test{}".format(test)][inst]["C"]["filename"]
                    elif param == 1:
                        A = dict_triplet[str(k)][str(l)]["test{}".format(test)][inst]["C"]["filename"]
                        B = dict_triplet[str(k)][str(l)]["test{}".format(test)][inst]["Y"]["filename"]
                else:
                    A = dict_triplet[str(k)][str(l)]["test{}".format(test)][inst]["A"]["filename"]
                    B = dict_triplet[str(k)][str(l)]["test{}".format(test)][inst]["B"]["filename"]
                        
                references["X{}".format(count)]= "configs/2024sp/resources/set{}/{}/{}/{}".format(k, inst, l, X)
                samplesA["A{}".format(count)]= "configs/2024sp/resources/set{}/{}/{}/{}".format(k, inst, l, A)
                samplesB["B{}".format(count)]= "configs/2024sp/resources/set{}/{}/{}/{}".format(k, inst, l, B)
                count = count + 1
    references["X{}".format(count)]= "configs/2024sp/resources/samples/dummyX1.wav"
    samplesA["A{}".format(count)]= "configs/2024sp/resources/samples/dummyX1.wav"
    samplesB["B{}".format(count)]= "configs/2024sp/resources/samples/dummyB1.wav"
    count = count + 1
    references["X{}".format(count)]= "configs/2024sp/resources/samples/dummyX2.wav"
    samplesA["A{}".format(count)]= "configs/2024sp/resources/samples/dummyA2.wav"
    samplesB["B{}".format(count)]= "configs/2024sp/resources/samples/dummyX2.wav"

        
    explain = '<li>3つの楽器音Reference,A,Bを順番に聴いてください<br> <b>楽器音は全て必ず最後まで聞いてください</b> </li> <li>その下に列挙された3つの要素（音色、リズム、メロディ）においてそれぞれ、<br> Referenceが<b>BよりA</b>に<b>強く近い</b>と感じる場合は<b>A+</b>を、<b>少し近い</b>と感じる場合は<b>A-</b>回答してください。<br> Referenceが<b>AよりB</b>に<b>強く近い</b>と感じる場合は<b>B+</b>を、<b>少し近い</b>と感じる場合は<b>B-</b>回答してください。<br> <b>再生した楽器音がその要素を持たない（例: ドラム音にメロディがない）場合は、N/Aを選択してください。</b><br> また、A,Bどちらも同じくらいReferenceと似ている/似ていない場合もN/Aを選択することができますが、<b>3つの要素全てにおいてN/Aという回答はできません</b>。<br> </li> <li> 総合的に判断してReferenceはAとBのどちらに近いかを、上記と同様に+と-を含めた4択から選択してください。<b>"総合"では真ん中は選択できません。</b></li> <li>選択を終えたら"Next"ボタンを押し、次の実験に進んで下さい。</li>'
    enquete = '<li>最後にアンケートのご協力をお願いいたします。</li> <li>何か演奏することができる楽器がありますか？</li>'
    
    config = {
        "testname": "Instrumental Similarity ABX Test",
        "testId": testname,
        "bufferSize": 2048,
        "stopOnErrors": True,
        "showButtonPreviousPage": True,
        "remoteService": "service/write.php",


        "pages":[
            
            {"type": "generic",
            "content": "楽器音類似度に関する評価実験にご参加いただきありがとうございます。<br> 実験終了後に再度、支払いのためのクラウドワークスIDの入力を求められますので、忘れずにご記入ください。",
            "id": "first_page",
            "name": "Welcome",
            },
            {"type": "generic",
            "content": explain,
            "id": "Top_page",
            "name": "Instrumental Similarity Test",
            },
            {"type": "volume",
            "content": "音量を調整してください．このサンプルはベース音の例です.",
            "id": "vol",
            "name": "音量調整",
            "defaultVolume": 0.5,
            "stimulus": "configs/2024sp/resources/samples/voleme_sample.wav",            
            },
            {"type": "paired_comparison_changed",
            "id": "test0212",
            "name": "Instrumental Similarity Test",
            "content": explain,
            "showWaveform": True,
            "enableLooping": False,
            "reference":
                references,
            "sampleA":
                samplesA,
            "sampleB":
                samplesB,}
            ,
            {
            "type": "enquete",
            "content": enquete,
            "id": "enq",
            "name": "楽器演奏に関するアンケート",
            },
            {"type": "finish",
            "name": "Thank you",
            "content": "ご協力ありがとうございました！.<br> <b>支払いのため，以下にクラウドワークスIDの入力をお願いします．<b>",
            "questionnaire":
                {"label": "Worker Id",
                "name": "workerId",
                "type": "text"},
            "showResults": False,
            "writeResults": True,}
            
        ]
    }
    
    os.makedirs('./configfiles/{}'.format(testname), exist_ok=True)
    with open('./configfiles/{}/config_set{}.yaml'.format(testname, k), 'w', encoding='utf-8') as f:
        yaml.dump(config, f, allow_unicode=True, default_flow_style=False, sort_keys=False)