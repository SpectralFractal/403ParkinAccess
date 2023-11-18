import cv2
import torch
import numpy as np
import time

from ultralytics import YOLO

points = []
# 1 minut e 5 minute

def POINTS(event, x, y, flags, param):
    if event == cv2.EVENT_MOUSEMOVE:
        colorsBGR = [x, y]
        print(colorsBGR)


cv2.namedWindow('FRAME')

model = YOLO("yolo-Weights/yolov8x.pt")

cap = cv2.VideoCapture("ezgif.com-video-cutter.mp4")
count = 0
frame_counter = 0

area_1 = [(100, 450), (231, 467), (283, 262), (165, 264)]
area_2 = [(233, 463), (332, 488), (377, 264), (284, 262)]
area_3 = [(336, 467), (442, 470), (472, 261), (379, 265)]
area_4 = [(445, 488), (561, 504), (577, 258), (475, 266)]
area_5 = [(561, 479), (684, 505), (685, 259), (583, 260)]
area_6 = [(684, 495), (843, 491), (832, 264), (685, 255)]
area_7 = [(685, 256),(818, 250), (805, 61), (692, 61)]
area_8 = [(581, 256), (685, 259), (689, 84), (591, 96)]
area_9 = [(474, 270), (578, 259), (590, 97), (500, 95)]
area_10 = [(376, 269), (473, 269), (497, 98), (407, 102)]

areas = [area_1, area_2, area_3, area_4, area_5, area_6, area_10, area_9, area_8, area_7]


while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_counter += 1

    if frame_counter % 10 == 0:
        frame = cv2.resize(frame, (1020, 600))
        results = model(frame)
        some_list = []
        free_space = [1] * 10





        results = model(frame)
        # print(type(results))
        # print(results)
        some_list = []
        free_space = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

        for detection in results:
            boxes = detection.boxes

            for box in boxes:
                conf = box.conf
                # print("orice ",box.xyxy)
                xyxy = box.xyxy[0]
                x1, y1, x2, y2 = xyxy
                x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
                cls_id = box.cls.item()

                d = model.names[cls_id]
                cx = int(x1 + x2) // 2
                cy = int(y1 + y2) // 2
                if 'car' in d:
                    for area in areas:
                        area_tuple = tuple(map(tuple, area))

                        results = cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False)
                        if results >= 0:
                            # print(results)
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 3)
                            cv2.putText(frame, str(d), (x1, y1), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)
                            some_list.append([cx])
                            area_index = areas.index(area)
                            free_space[area_index] = 0
            # se citeste fiecare rand de la stanga la dreapta
            print(free_space)



            for area in areas:
                cv2.polylines(frame, [np.array(area, np.int32)], True, (0, 255, 0), 2)
                a = len(some_list)
                cv2.putText(frame, str(a), (50, 49), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)






        cv2.imshow("FRAME", frame)
        cv2.setMouseCallback("FRAME", POINTS)


    # time.sleep(0.1)
    if cv2.waitKey(1) & 0xFF == 27:
        break
cap.release()
cv2.destroyAllWindows()



