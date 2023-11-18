"""
Primary API route endpoints

"""
import cv2
import torch
import numpy as np
import time

from ultralytics import YOLO
from fastapi import APIRouter
from starlette.responses import RedirectResponse

# Init FastAPI router for API endpoints
api_routes = APIRouter()


def POINTS(event, x, y, flags, param):
    if event == cv2.EVENT_MOUSEMOVE:
        colorsBGR = [x, y]
        print(colorsBGR)


@api_routes.get('/')
def check_server():
    """Check if the server is running"""
    return {"message": "Server is up and running!"}


@api_routes.get('/')
def redirect_to_docs():
    """Redirect to API docs when at site root"""
    return RedirectResponse('/redoc')


@api_routes.get('/hello/{name}')
async def get_hello(name: str = 'world'):
    return dict(hello=name)


@api_routes.get('/parking')
async def get_hello():
    cap = cv2.VideoCapture("camin.mp4")
    ret, frame = cap.read()

    if ret:
        cv2.imshow("Frame", frame)
        cv2.waitKey(0)
    else:
        print("Failed to read from the video file")

    cap.release()
    cv2.destroyAllWindows()

