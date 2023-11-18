import base64
import json

import cv2
import numpy
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from base64 import b64encode
import time
from ultralytics import YOLO
import math
import numpy

model = YOLO("yolo-Weights/yolov8s.pt")

ws_router = APIRouter()

detector = cv2.CascadeClassifier('./Haarcascades/haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('./Haarcascades/haarcascade_eye.xml')

# object classes
classNames = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat",
              "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
              "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
              "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat",
              "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
              "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
              "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant", "bed",
              "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone",
              "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
              "teddy bear", "hair drier", "toothbrush"
              ]


@ws_router.websocket("/check_ws_connection")
async def check_ws_connection(websocket: WebSocket):
    await websocket.accept()

    try:
        data = await websocket.receive_text()
        # Perform any necessary checks or operations on the WebSocket data

        # Example: Send a message back to the WebSocket client
        await websocket.send_text("WebSocket connection is active and checked.")
    except WebSocketDisconnect as e:
        print("WebSocket connection closed unexpectedly")
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
    finally:
        await websocket.close()


# best performance for sending processed images
@ws_router.websocket("/ws-fast")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    processing_times = []
    frame_counter = 0

    try:
        while True:
            data = await websocket.receive_bytes()

            start_time = time.time()  # Start time of processing

            # Convert to a numpy array
            nparr = numpy.frombuffer(data, numpy.uint8)

            # Decode image
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is not None:
                # Perform image processing as before
                faces = detector.detectMultiScale(frame, 1.3, 5)
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                    roi_gray = gray[y:y + h, x:x + w]
                    roi_color = frame[y:y + h, x:x + w]
                    eyes = eye_cascade.detectMultiScale(roi_gray, 1.3, 3)
                    for (ex, ey, ew, eh) in eyes:
                        cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)

                _, buffer = cv2.imencode('.jpg', frame)
                frame_encoded = b64encode(buffer).decode('utf-8')
                processing_time = time.time() - start_time  # End time of processing
                processing_times.append(processing_time)
                frame_counter += 1
                print(f"Processing time: {processing_time} seconds")

                # aici le trimite inapoi
                await websocket.send_text('data:image/jpeg;base64,' + frame_encoded)
            else:
                print('Frame is None')
    except WebSocketDisconnect:
        get_time(processing_times, frame_counter)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await websocket.close()


# Function used for getting the average time for a frame render
def get_time(processing_times=None, frame_counter=None):
    total_processing_time = sum(processing_times)
    print(f"Total processing time for all images: {total_processing_time} seconds")
    print(f"Total frames processed: {frame_counter}")

    if frame_counter > 0:
        average_processing_time = total_processing_time / frame_counter
        print(f"Average processing time per frame: {average_processing_time} seconds")
    else:
        print("No frames were processed.")


# @ws_router.websocket("/ws-yolo")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     processing_times = []
#     frame_counter = 0
#
#     try:
#         while True:
#             data = await websocket.receive_bytes()
#             nparr = numpy.frombuffer(data, numpy.uint8)
#             img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#             results = model(img)
#
#             for r in results:
#                 boxes = r.boxes
#
#                 for box in boxes:
#                     # bounding box
#                     x1, y1, x2, y2 = box.xyxy[0]
#                     x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)  # convert to int values
#
#                     # put box in cam
#                     cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)
#
#                     # confidence
#                     confidence = math.ceil((box.conf[0] * 100)) / 100
#                     print("Confidence --->", confidence)
#
#                     # class name
#                     cls = int(box.cls[0])
#                     print("Class name -->", classNames[cls])
#
#                     # object details
#                     org = [x1, y1]
#                     font = cv2.FONT_HERSHEY_SIMPLEX
#                     font_scale = 1
#                     color = (255, 0, 0)
#                     thickness = 2
#
#                     cv2.putText(img, classNames[cls], org, font, font_scale, color, thickness)
#
#             cv2.imshow("Doamne ajuta", img)
#             if cv2.waitKey(1) & 0xFF == 27:
#                 break
#
#             _, buffer = cv2.imencode('.jpg', img, [int(cv2.IMWRITE_JPEG_QUALITY), 100])
#             frame_encoded = b64encode(buffer).decode('utf-8')
#
#             await websocket.send_text('data:image/jpeg;base64,' + frame_encoded)
#     except WebSocketDisconnect:
#         await websocket.close()
#         get_time(processing_times, frame_counter)
#     except Exception as e:
#         print(f"Error: {e}")
#     finally:
#         await websocket.close()
#
#
# def POINTS(event, x, y, flags, param):
#     if event == cv2.EVENT_MOUSEMOVE:
#         colorsBGR = [x, y]
#         print(colorsBGR)
#
#
# cap = cv2.VideoCapture("../403ParkinAccess/backend/sample_videos/camin.mp4")
#
# area_1 = [(100, 450), (231, 467), (283, 262), (165, 264)]
# area_2 = [(233, 463), (332, 488), (377, 264), (284, 262)]
# area_3 = [(336, 467), (442, 470), (472, 261), (379, 265)]
# area_4 = [(445, 488), (561, 504), (577, 258), (475, 266)]
# area_5 = [(561, 479), (684, 505), (685, 259), (583, 260)]
# area_6 = [(684, 495), (843, 491), (832, 264), (685, 255)]
# area_7 = [(685, 256), (818, 250), (805, 61), (692, 61)]
# area_8 = [(581, 256), (685, 259), (689, 84), (591, 96)]
# area_9 = [(474, 270), (578, 259), (590, 97), (500, 95)]
# area_10 = [(376, 269), (473, 269), (497, 98), (407, 102)]
#
# areas = [area_1, area_2, area_3, area_4, area_5, area_6, area_10, area_9, area_8, area_7]
#
#
# @ws_router.websocket("/ws-parking-update")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     cv2.namedWindow('FRAME')
#
#     count = 0
#     frame_counter = 0
#
#     try:
#         while True:
#             data = await websocket.receive_bytes()
#
#             ret, frame = cap.read()
#             if not ret:
#                 break
#
#             frame_counter += 1
#
#             if frame_counter % 10 == 0:
#                 frame = cv2.resize(frame, (1020, 600))
#
#                 results = model(frame)
#                 # print(type(results))
#                 # print(results)
#                 some_list = []
#                 free_space = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
#
#                 for detection in results:
#                     boxes = detection.boxes
#
#                     for box in boxes:
#                         conf = box.conf
#                         # print("orice ",box.xyxy)
#                         xyxy = box.xyxy[0]
#                         x1, y1, x2, y2 = xyxy
#                         x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
#                         cls_id = box.cls.item()
#
#                         d = model.names[cls_id]
#                         cx = int(x1 + x2) // 2
#                         cy = int(y1 + y2) // 2
#                         if 'car' in d:
#                             for area in areas:
#                                 area_tuple = tuple(map(tuple, area))
#
#                                 results = cv2.pointPolygonTest(numpy.array(area, numpy.int32), (cx, cy), False)
#                                 if results >= 0:
#                                     # print(results)
#                                     cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 3)
#                                     cv2.putText(frame, str(d), (x1, y1), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)
#                                     some_list.append([cx])
#                                     area_index = areas.index(area)
#                                     free_space[area_index] = 0
#                     # se citeste fiecare rand de la stanga la dreapta
#                     print(free_space)
#
#                     for area in areas:
#                         cv2.polylines(frame, [numpy.array(area, numpy.int32)], True, (0, 255, 0), 2)
#                         a = len(some_list)
#                         cv2.putText(frame, str(a), (50, 49), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)
#
#             await websocket.send_text(json.dumps(free_space))
#
#     except WebSocketDisconnect:
#         await websocket.close()
#     except Exception as e:
#         print(f"Error: {e}")
#     finally:
#         await websocket.close()


@ws_router.websocket("/ws-parking-flavius")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    frame_counter = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_counter += 1

            if frame_counter % 10 == 0:
                # Your existing frame processing code...
                frame = cv2.resize(frame, (1020, 600))

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

                                results = cv2.pointPolygonTest(numpy.array(area, numpy.int32), (cx, cy), False)
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
                        cv2.polylines(frame, [numpy.array(area, numpy.int32)], True, (0, 255, 0), 2)
                        a = len(some_list)
                        cv2.putText(frame, str(a), (50, 49), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)

            await websocket.send_text(json.dumps(free_space))

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        print("ceva")
        await websocket.close()

@ws_router.websocket("/video")
async def video_endpoint(websocket: WebSocket):
    await websocket.accept()
    cap2 = cv2.VideoCapture("camin.mp4")

    while True:
        ret, frame = cap2.read()
        if not ret:
            print("Failed to grab frame")
            break

        height, width = frame.shape[:2]

        # Send frame size and data
        frame_data = {
            "size": {"width": width, "height": height}
        }

        # Send frame as text
        await websocket.send_text(json.dumps(frame_data))

    cap2.release()
    await websocket.close()
