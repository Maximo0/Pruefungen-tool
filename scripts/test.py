import os
import sys
import numpy as np
import fitz
import cv2
import pytesseract
from unidecode import unidecode
import re
import multiprocessing

# Testing
from pprint import pprint


# Global Parameters
sys.stdout.reconfigure(encoding='utf-8') # type: ignore | causes IDE error despite working
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

FILE_NAME = ""
    
def main():
        # clear the temp folder
        clear()

        print(sys.argv[1:])

        # Run the scheduler
        scheduler()

def update_file_name(name):
    global FILE_NAME
    FILE_NAME = name
    return FILE_NAME



def scheduler():
    all_tasks = []

    # Loop through all the argument paths
    for arg in sys.argv[1:]:
    # for arg in os.listdir(f"{ROOT_DIR}/Prüfungen"):
        try:
            # TESTING ONLY
            update_file_name(arg[0:-4])


            # Open the PDF
            doc = fitz.open(f"{ROOT_DIR}/Prüfungen/{arg}") # type: ignore | causes error despite working
            processes = []

            # Loop through all the pages of the PDF
            for page in range(doc.page_count):
                pixmap = doc[page].get_pixmap(dpi=300)
                pixmap.save(f"{ROOT_DIR}/temp/file-{page}.png")
                p = multiprocessing.Process(target=get_content, args=[page])
                p.start()
                processes.append(p)

            # Wait for all processes to finish
            for process in processes:
                process.join()

            # Process the information
            tasks = process_information()
            # Write the tasks to a file for testing
            with open(f"{ROOT_DIR}/test/{FILE_NAME}.txt", "a") as f:
                f.write("\n\nTasks:\n\n")
                for task in tasks:
                    f.write(f"{task}\n")
                f.close()
            for task in tasks:  
                all_tasks.append(task)

            # Close the PDF
            doc.close()

            # clear()
        except:
            # Clear the temp folder for the next cycle
            print("Failed to process file\nContinuing...")
            # clear()

    # Return tasks to the API for further processing
    pprint(all_tasks)

def get_content(page): 
    image = cv2.imread(f"{ROOT_DIR}/temp/file-{page}.png")
    # Return the OCR result
    if page == 0 or page == 1:
        psm = 3
    else: 
        psm = 6
    # psm = 6

    result = do_ocr(image, psm)

    with open(f"{ROOT_DIR}/temp/file-{page}.txt", "w") as f:
        f.write(result) # type: ignore
        f.close()







def process_information():
    tasks = get_tasks()
    pages = get_pages()
    semester, test_type = get_main_information()

    task_info_list = []

    for i, task in enumerate(tasks):
        task_info = {
            "semester": semester,
            "test_type": test_type,
            "tasks": tasks[i],
            "page": pages[i][0],
        }
        task_info_list.append(task_info)


    return task_info_list


# Functions for getting information from the temp files
def get_main_information():
    # Extract the main from the first page of the PDF
    with open(f"{ROOT_DIR}/temp/file-0.txt") as f:
        text = f.read()

        # Get Semester
        semester = re.search(r"(Sommer \d{4})|(Winter \d{4})", text).group() # type: ignore | causes error despite working

        # Get Type of test
        test_type = re.findall(r"(Ganzheitliche Aufgabe [I|l]{2})|(Anwendungsentwicklung)|(Systemintegration)|(IT-System-)", text, re.IGNORECASE)
        

        # Initialize an empty list to store the matched test types
        matched_types = []

        with open(f"{ROOT_DIR}/test/{FILE_NAME}.txt", "a") as test:
            test.write("\nBereich: \n\n")
            test.write(f"{str(test_type)}")
            test.close()

        # Loop through the matches and append the matched test types to the list
        for t in test_type:
            if t[0]:
                matched_types.append("GA2")
                break
            elif t[3]:
                matched_types.append("GA2")
                break
            elif t[1]:
                matched_types.append("GA1 FIAE")
            elif t[2]:
                matched_types.append("GA1 FISI")

        # Check if any test types were matched and set the test_type variable accordingly
        if "GA2" in matched_types:
            test_type = "GA2"
        elif matched_types:
            test_type = ", ".join(matched_types)
        else:
            test_type = "Not Found"

        return semester, test_type

def get_tasks():
    # Extract tasks from the text files
    temp_folder = f"{ROOT_DIR}/temp"

    # Process the image
    img = cv2.imread(f"{temp_folder}/file-1.png")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite("test images/gray.png", gray)

    blur = cv2.GaussianBlur(gray, (9, 9), 10)
    cv2.imwrite("test images/blur.png", blur)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    cv2.imwrite("test images/thresh.png", thresh)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 3))
    cv2.imwrite("test images/kernel.png", kernel)
    dilate = cv2.dilate(thresh, kernel, iterations=1)
    cv2.imwrite("test images/dilate.png", dilate)
    cnts = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    # Create the ROI image for Pytesseract to process
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if h > 200 and w > 20:
            roi = img[y:y+h, x:x+w]

            # Save the ROI as an image
            cv2.imwrite("test images/roi.png", roi)
    
    # Process the image with Pytesseract
    config = r"--psm 6 --oem 3"
    ocr_result = pytesseract.image_to_string(roi, config=config, lang="deu+eng")

    # Write the result to a file for testing
    with open(f"{ROOT_DIR}/test/roi.txt", "w") as test:
        test.write(ocr_result)
        test.close()

    tasks = re.findall(r"(\d[.,]\s{1}.+)", ocr_result, re.MULTILINE)
    tasks = [task[3:].strip() for task in tasks]

    return tasks

    # with open(f"{temp_folder}/file-1.txt", "r") as f:
    #     text = f.read()
    #     tasks = re.findall(r"(\d[.,]\s{1}.+)", text, re.MULTILINE)[:5]
    #     tasks = [task[3:].strip() for task in tasks]
    #     return tasks

def get_pages():
    # Extract page numbers from the text files and return a list
    temp_folder = f"{ROOT_DIR}/temp"
    counter = 0
    pages = []

    # Get a sorted list of filenames in the temp_folder directory
    filenames = sorted(os.listdir(temp_folder), key = lambda x: x[-6:-4])

    with open(f"{ROOT_DIR}/test/{FILE_NAME}.txt", "a") as test:
        test.write("Extracted Pages:\n\n")

        # Loop through the files and extract the page numbers
        for filename in filenames:
            if filename.endswith(".txt"):
                file_path = os.path.join(temp_folder, filename)
                with open(file_path, "r") as f:
                    text = f.read()

                    RegString = r"(?:[1-5]+[.,:][\t ]*(?:Handlungsschritt|[Handlungsschritt]+)[\t :]+)(?:\([\d*\t +Punkte\)]+)?(?<=\S)"
                    matches = re.findall(RegString, text, re.MULTILINE)

                    # print(f"Page {counter}: ",matches)
                    test.write(f"Page {counter}: {matches}\n")

                    if matches:
                        pages.append([counter, matches[0][0]])
                    f.close()

                    # Add first page to list since it always has the first task
                    if counter == 1:
                        if not matches:
                            pages.append([counter, "1"])

                counter += 1
        # CLOSE TEST FILE
        test.close()

    # print(pages)

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
    

def do_ocr(image, psm):
    # Run the OCR on the image
    try:
        ocr_result = pytesseract.image_to_string(
            # PSM 1 for accurate results
            # PSM 12 for most results in no order
            image, config=f"--psm {psm} --oem 1", lang="deu+eng")
        ocr_result = unidecode(ocr_result)
        return ocr_result
    except:
        print("Failed OCR of image")
        pass


def clear():
    # Clear the temp folder
    dir = f'{ROOT_DIR}/temp'
    for f in os.listdir(dir):
        os.remove(os.path.join(dir, f))


if len(sys.argv) < 1:
    print("Please provide a path to the PDF file")
    exit()

# Make temp folder if it doesn't exist
if os.path.isdir(f"{ROOT_DIR}/temp") == False:
    os.mkdir(f"{ROOT_DIR}/temp")

if __name__ == '__main__':
    main()

