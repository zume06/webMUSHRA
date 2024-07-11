from pydub import AudioSegment
import os

for filename in os.listdir("./resources_mono"):
    sound = AudioSegment.from_wav("./resources_mono/")
    sound = sound.set_channels(2)
    sound.export("/Path/to/変換後のファイル名.wav", format="wav")