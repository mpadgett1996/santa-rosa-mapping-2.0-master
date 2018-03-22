#!/bin/bash

#run the script with "./convertWEBM.sh <inputfilename> <outputfilename>"

#This conversion is for the firefox on windows support
inputfile=$1 
outputfile=$2

#See more at: http://www.oodlestechnologies.com/blogs/Convert-VP9-codec-videos-using-Ffmpeg#sthash.McXqnt4H.dpuf

#run ffmpeg before making the conversion
ffmpeg
#script with the flags to convert the videos to webm with the vp9 codec
#converts the video to a webm format with a h264 video encoding and an
#aac audio encoding
#on a multi core server, what this will hopefully run on, -threads will convert this using 2 cores

ffmpeg -i $inputfile -c:v libvpx-vp9 -b:v 2000k -threads 8 -speed 4 -tile-columns 6 -frame-parallel 1 -c:a libvorbis $outputfile


#ffmpeg -i $inputfile -c:v libvpx-vp9 -pass 1 -b:v 1000K -threads 8 -speed 4 -tile-columns 6 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -an -f webm /dev/null
#ffmpeg -i $inputfile -c:v libvpx-vp9 -pass 2 -b:v 1000K -threads 8 -speed 1 -tile-columns 6 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -c:a libopus -b:a 64k -f webm $outputfile
