import json
import yaml



with open("./sample_list/dict_triplet.json", "r") as f:
    dict_triplet = json.load(f)
    
explain = '<li>3つの楽器音Reference,A,Bを順番に聴いてください <br><b>楽器音は全て必ず最後まで聞いてください</b></li> <li>その下に列挙された3つの要素（音色、リズム、メロディ）においてそれぞれ、<br>Referenceが<b>BよりA</b>に<b>強く近い</b>と感じる場合は<b>A+</b>を、<b>少し近い</b>と感じる場合は<b>A-</b>回答してください。<br> Referenceが<b>AよりB</b>に<b>強く近い</b>と感じる場合は<b>B+</b>を、<b>少し近い</b>と感じる場合は<b>B-</b>回答してください。<br> <b>再生した楽器音がその要素を持たない（例: ドラム音にメロディがない）場合は、N/Aを選択してください。</b><br> また、A,Bどちらも同じくらいReferenceと似ている/似ていない場合もN/Aを選択することができますが、<b>3つの要素全てにおいてN/Aという回答はできません</b>。<br> </li> <li> 総合的に判断してReferenceはAとBのどちらに近いかを、上記と同様に+と-を含めた4択から選択してください。<b>"総合"では真ん中は選択できません。</b></li> <li>選択を終えたら"Next"ボタンを押し、次の実験に進んで下さい。</li>'
config = {
    "testname": "Instrumental Similarity ABX Test",
    "testId": "abx_changed",
    "bufferSize": 2048,
    "stopOnErrors": "true",
    "showButtonPreviousPage": "true",
    "remoteService": "service/write.php",


    "pages":{

        "type": "paired_comparison_changed",
        "id": "trialAB2",
        "name": "Instrumental Similarity Test",
        "content": explain,
        "showWaveform": "true",
        "enableLooping": "false",
        "reference": "configs/resources/audio/mono_ref.wav",
        "stimuli":{
            "C1": "configs/2024sp/resources/{}.wav".format(X),
            "C2": "configs/2024sp/resources/{}.wav".format(A),
            "C3": "configs/2024sp/resources/{}.wav".format(B),
        },
        "type": "finish",
        "name": "Thank you",
        "content": "Thank you for attending",
        "showResults": "true",
        "writeResults": "true",
        }
}