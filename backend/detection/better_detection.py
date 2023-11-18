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

model = YOLO("yolo-Weights/yolov8m.pt")

cap = cv2.VideoCapture("20231118_100911.mp4")
count = 0
frame_counter = 0

area_1 = [(44, 487), (160, 490), (219, 259), (116, 264)]
area_2 = [(160, 490), (280, 497), (326, 265), (219, 259)]
area_3 = [(280, 497), (407, 505), (441, 265), (326, 265)]
area_4 = [(407, 505), (561, 504), (577, 258), (441, 265)]
area_5 = [(561, 504), (684, 505), (685, 259), (577, 258)]
area_6 = [(680, 515), (835, 532), (821, 251), (685, 259)]
area_7 = [(685, 259),(821, 251), (821, 44), (687, 56)]
area_8 = [(553, 255), (682, 256), (687, 56), (571, 63)]
area_9 = [(442, 256), (557, 255), (573, 59), (467, 72)]
area_10 = [(327, 260), (441, 257), (466, 71), (364, 77)]

areas = [area_1, area_2, area_3, area_4, area_5, area_6, area_10, area_9, area_8, area_7]

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_counter += 1

    if frame_counter % 30 == 0:
        frame = cv2.resize(frame, (600, 1020))
        frame = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)
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
            cv2.putText(frame, str(free_space), (33, 582), cv2.FONT_HERSHEY_PLAIN, 3, (255, 0, 0), 2)
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


