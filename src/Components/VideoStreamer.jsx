import React, {useEffect, useRef, useState} from 'react';

function VideoStreamer(props) {

    const [streaming, setStreaming] = useState(false);
    const videoRef = useRef(null);
    const socketRef = useRef(null)

    useEffect(() => {
        async function getVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                setStreaming(true);
            } catch (err) {
                // Handle the error
                console.error('Error accessing the webcam', err);
            }
        }

        getVideo();
    }, [videoRef]);


    useEffect(() => {
        socketRef.current = new WebSocket('ws://your-backend-server.com/path');

        socketRef.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        socketRef.current.onmessage = (message) => {
            // Handle incoming messages, such as processed frames from the server
        };

        return () => {
            socketRef.current.close();
        };
    }, []);

    useEffect(() => {
        if (streaming) {
            const interval = setInterval(() => {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');

                // Draw the video frame to the canvas
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                // Convert the canvas to a data URL and send it through the WebSocket
                canvas.toBlob(blob => {
                    socketRef.current.send(blob);
                }, 'image/jpeg');
            }, 100); // Send a frame every 100 ms

            return () => clearInterval(interval);
        }
    }, [streaming]);


    return (
        <div>
            <video ref={videoRef} autoPlay playsInline />
        </div>
    );
}

export default VideoStreamer;