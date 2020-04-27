#!/bin/sh
# file: reshape.sh
identify -format "%w %h %f\n" *.jpg | sort -n -r -k 1 | head -n 1
identify -format "%w %h %f\n" *.jpg | sort -n -r -k 2 | head -n 1
for x in *.jpg;
    do
    echo "Running "${x##*/}" ...";
    convert "$x" -resize 250!X250! "${x##*/}"
done
