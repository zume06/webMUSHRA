#!/bin/sh

wav_dir=taslp_wav_jvs_mid
sample_rate=24000
mkdir norm
mkdir stereo

for file in $(find ${wav_dir} -type f -name *.wav); do
    ./../normpow/normpow/normpow -f ${sample_rate} ${file} norm/${file}
    ./bin/convert_mono_to_stereo.sh norm/${file} stereo/${file}
done