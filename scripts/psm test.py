import os
import sys
import re

import pytesseract
from unidecode import unidecode
import cv2

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
page = 0
FILE_NAME = sys.argv[1:][0][0:-4]

image = cv2.imread(f"{ROOT_DIR}/temp/file-{page}.png")

def do_ocr(image, psm, oem):
    # Run the OCR on the image
    try:
        ocr_result = pytesseract.image_to_string(
            image, config=f"--psm {psm} --oem {oem}", lang="deu+eng")
        ocr_result = unidecode(ocr_result)
        return ocr_result
    except:
        print(f"Failed OCR of image\n[psm={psm}, oem={oem}]")
        pass

# Test all combinations of psm and oem
psm_values = range(14)
results = []
for psm in psm_values:
    result = do_ocr(image, psm, 1)
    results.append((psm, 1, result))

# Write the results to a file
with open(f"{ROOT_DIR}/PSM/{FILE_NAME}.txt", "w") as f:
    for psm, oem, result in results:  
        f.write(f"psm={psm}, oem={oem}\n")
        f.write(str(result))
        f.write("\n\n")
    f.close()