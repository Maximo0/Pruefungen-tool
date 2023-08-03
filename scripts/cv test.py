import cv2

# Process the image
img = cv2.imread(f"temp/file-1.png")

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