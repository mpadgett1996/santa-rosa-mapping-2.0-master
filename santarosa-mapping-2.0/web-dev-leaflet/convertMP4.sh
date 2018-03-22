#!/bin/bash

#run the script using "./convertMP4.sh <inputfilename> <outputfilename>

inputfile=$1
outputfile=$2

#need to run ffmpeg before making the conversion
ffmpeg
#script with the flags to convert the videos to mp4 with the aac audio codec
#and h.264 video codec
ffmpeg -i $inputfile -y -strict experimental -acodec aac -ac 2 -ab 160k -vcodec libx264 -s 640x480 -pix_fmt yuv420p -preset slow -profile:v baseline -level 30 -maxrate 10000000 -bufsize 10000000 -b 1200k -f mp4 -threads 0 $outputfile
