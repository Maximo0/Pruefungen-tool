import fast_deskew
import os
import sys
import tempfile
import fitz
import re
import cv2
from pytesseract import image_to_string
import concurrent.futures
from unidecode import unidecode
import json

from pprint import pprint
import time

# Global Parameters
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = f"{tempfile.gettempdir()}\pruefungs-app"

# Main function


def main():
    all_tasks = []
    total_files = len(sys.argv[1:])
    current_file = 1

    # clear the temp folder before starting
    clear_temp()

    # Loop through all the argument paths
    for arg in sys.argv[1:]:

        progress = ((current_file - 1) * 4 + 1) / (total_files * 4) * 100
        print(json.dumps(
            {'type': 'progress', 'data': progress, "current_task": f"Schritt 1 von 4 / Datei: {current_file} von {total_files}"}), flush=True)

        # Opens PDF and splits it into images
        split_pdf(arg)
        
        # Print progress of step 1 of 4
        progress = ((current_file - 1) * 4 + 2) / (total_files * 4) * 100
        print(json.dumps(
            {'type': 'progress', 'data': progress, "current_task": f"Schritt 2 von 4 / Datei: {current_file} von {total_files}"}), flush=True)

        # Do OCR on the imes in parallel
        with concurrent.futures.ThreadPoolExecutor() as executor:
            for page in range(len(os.listdir(TEMP_DIR))):
                executor.submit(do_ocr, page, 1)

        # Wait for all tasks to complete
        executor.shutdown()

        # Print progress of step 3 of 4
        progress = ((current_file - 1) * 4 + 3) / (total_files * 4) * 100
        print(json.dumps(
            {'type': 'progress', 'data': progress, "current_task": f"Schritt 3 von 4 / Datei: {current_file} von {total_files}"}), flush=True)

        # Process the information
        # 1. get all the tasks in order
        tasks = get_tasks()
        # 2. get pages to those tasks
        pages = get_pages()
        # 3. get Semester to those tasks
        semester = get_semester()
        # 4. get test type to those tasks (GA1 FISI, GA1 FIAE, GA2)
        test_type = get_testtype()
        # 5. Filepath to the PDF
        filepath = arg

        # Append task to the list
        for i, task in enumerate(tasks):
            all_tasks.append({
                "task": task,
                "page": pages[i][0],
                "semester": semester,
                "test_type": test_type,
                "filepath": filepath
            })

        # Print progress of step 4 of 4
        progress = ((current_file - 1) * 4 + 4) / (total_files * 4) * 100
        print(json.dumps(
            {'type': 'progress', 'data': progress, "current_task": f"Schritt 4 von 4 / Datei: {current_file} von {total_files}"}), flush=True)
        # Increment the current file counter for the progress update
        current_file += 1

        # Clear the temp folder for the next cycle
        clear_temp()

    # Return tasks to the API for further processing
    return all_tasks


# Gathers all tasks present in the PDF
def get_tasks():
    # Process the image
    img = cv2.imread(f"{TEMP_DIR}/file-1.png")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (9, 9), 10)
    thresh = cv2.threshold(
        blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 3))
    dilate = cv2.dilate(thresh, kernel, iterations=1)
    cnts = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    # Create the ROI image for Pytesseract to process
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if h > 200 and w > 20:
            roi = img[y:y+h, x:x+w]

    # Process the image with Pytesseract
    config = r"--psm 6 --oem 3"
    ocr_result = image_to_string(roi, config=config, lang="deu+eng")

    tasks = re.findall(r"(\d[.,]\s{1}.+)", ocr_result, re.MULTILINE)
    tasks = [task[3:].strip() for task in tasks]
    return tasks


# Gathers all the page numbers for the tasks
def get_pages():
    pages = []
    counter = 0

    # Get a sorted list of filenames in the temp_folder directory
    filenames = sorted(os.listdir(TEMP_DIR), key=lambda x: x[-6:-4])
    for filename in filenames:
        if filename.endswith(".txt"):
            # with open(os.path.join(TEMP_DIR, filenam  e), "r") as f:
            with open(f"{TEMP_DIR}/{filename}", "r") as f:
                content = f.read()
                # matches = re.findall(r"(^\d[.,] Handlungsschritt)", text, re.MULTILINE)
                matches = re.findall(
                    r"\d+[.,]\s*(?:(?:Han\s+hritt|Handlungsschritt)[\s:]+)?(?:\(\d*\s+Punkte\))", content, re.MULTILINE)

                # print(f"Page {counter}: ",matches)

                if matches:
                    pages.append([counter, matches[0][0]])
                f.close()
                f.close()
            counter += 1

        # Extra check to fill in pages that couldnt be found
    final_pages = []
    for i in range(len(pages)):
        if i == 0:
            final_pages.append(pages[i])
        else:
            prev_num = int(pages[i-1][1])
            curr_num = int(pages[i][1])
            if curr_num - prev_num == 1:
                final_pages.append(pages[i])
            else:
                for j in range(prev_num+1, curr_num):
                    final_pages.append(["", str(j)])
                final_pages.append(pages[i])

    return final_pages


# get the semester
def get_semester():
    with open(f"{TEMP_DIR}/file-0.txt", "r") as f:
        content = f.read()
        semester = re.search(r"(Sommer \d{4})|(Winter \d{4})", content).group()
        f.close()
    return semester


def get_testtype():
    with open(f"{TEMP_DIR}/file-0.txt", "r") as f:
        content = f.read()
        test_type = re.findall(
            r"(Ganzheitliche Aufgabe [I|l]{2})|(Anwendungsentwicklung)|(Systemintegration)", content)
        f.close()

    for t in test_type:
        if t[0]:
            return "GA2"
        elif t[1]:
            return "GA1 FIAE"
        elif t[2]:
            return "GA1 FISI"
        else:
            return "Unknown"


def split_pdf(arg):
    doc = fitz.open(arg)

    # Create a thread pool
    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Loop through all the pages of the PDF
        for page in range(doc.page_count):
            pixmap = doc[page].get_pixmap(dpi=300)
            # Save the pixmap as JPEG
            executor.submit(save_pixmap, pixmap, page)

    # Wait for all tasks to complete
    executor.shutdown()
    doc.close()


def save_pixmap(pixmap, page):
    # Save the pixmap as JPEG
    pixmap.save(f"{TEMP_DIR}/file-{page}.png")

    # Deskew image
    deskew_image(page)


# Runs the OCR on the image
def do_ocr(page, psm):
    try:
        ocr_result = image_to_string(
            f"{TEMP_DIR}/file-{page}.png",
            config=f'--psm {psm} --oem 1', lang='deu+eng')
        ocr_result = unidecode(ocr_result)

        with open(f"{TEMP_DIR}/file-{page}.txt", "w") as f:
            f.write(ocr_result)  # type: ignore
            f.close()
    except Exception as e:
        print(f"Error: {e}")
        pass


# Deskew the image


def deskew_image(page):
    result_image = fast_deskew.deskew(f"{TEMP_DIR}/file-{page}.png")
    cv2.imwrite(f"{TEMP_DIR}/file-{page}.png", result_image)


# Clears the temp folder
def clear_temp():
    for file in os.listdir(TEMP_DIR):
        os.remove(f"{TEMP_DIR}\{file}")
    return


# Check if Folder in Temp exists
if os.path.isdir(TEMP_DIR) == False:
    os.mkdir(TEMP_DIR)

if __name__ == '__main__':
    tasks = main()
    print(json.dumps({'type': 'result', 'data': tasks}), flush=True)
