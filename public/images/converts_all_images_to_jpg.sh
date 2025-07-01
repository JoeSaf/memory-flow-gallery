#!/bin/bash

count=0
total=$(ls *.{jpeg,png,heic,HEIC,JPEG,PNG,gif,bmp,tiff,webp,WEBP} 2>/dev/null | wc -l)

echo "Starting conversion of $total images to JPG..."
echo "Original files will be deleted after successful conversion."

for file in *.{jpeg,png,heic,HEIC,JPEG,PNG,gif,bmp,tiff,webp,WEBP}; do
    if [ -f "$file" ]; then
        ((count++))
        echo "Converting $count/$total: $file"
        
        # Convert to JPG
        if magick "$file" -quality 90 "${file%.*}.jpg"; then
            # Only delete original if conversion was successful
            rm "$file"
            echo " ✓ Converted and removed original"
        else
            echo " ✗ Conversion failed, keeping original"
        fi
    fi
done

echo "Conversion complete! Only JPG files remain."