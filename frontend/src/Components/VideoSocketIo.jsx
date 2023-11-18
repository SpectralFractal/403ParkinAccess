import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const VideoComponent = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState("");

  const [emitCount, setEmitCount] = useState(0);
  const [sendCount, setSendCount] = useState(0);

  // useEffect(() => {
  //   // Initialize socket connection
  //   socketRef.current = io('http://localhost:5000');
  //
  //   // Get video stream
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //       .then(stream => {
  //         // Show video to user
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //         }
  //
  //         // Send video stream to Flask server via socket.io
  //         stream.getVideoTracks()[0].onended = () => {
  //           socketRef.current.disconnect();
  //         };
  //
  //         // Process and send frames to server
  //         const sendVideoFrame = () => {
  //           const frame = captureVideoFrame(videoRef.current, 'jpeg');
  //           socketRef.current.emit('video-stream', frame.dataUri);
  //           requestAnimationFrame(sendVideoFrame);
  //         };
  //
  //         requestAnimationFrame(sendVideoFrame);
  //       })
  //       .catch(err => {
  //         console.error('Error accessing media devices.', err);
  //       });
  //
  //     socketRef.current.on('response-frame', (data) => {
  //         console.log("wtf")
  //         setVideoSrc(data.data);
  //     });
  //
  //   return () => {
  //     // Clean up
  //     if (socketRef.current) {
  //       socketRef.current.disconnect();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:5000");

    // Get video stream
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Show video to user
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Send video stream to Flask server via socket.io
        stream.getVideoTracks()[0].onended = () => {
          socketRef.current.disconnect();
        };

        // Process and send frames to server at 1-second intervals
        const intervalId = setInterval(() => {
          const frame = captureVideoFrame(videoRef.current, "jpeg", 0.1);
          setSendCount((prevState) => prevState + 1);
          socketRef.current.emit("video-stream", frame.dataUri);
        }, 200);

        return () => clearInterval(intervalId); // Clear the interval when the component unmounts
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });

    socketRef.current.on("response-frame", (data) => {
      // console.log("Received image data:", data);
      // const isDataUri = data.data && /^data:image\/[a-zA-Z]+;base64,/.test(data);
      if (data && data.data) {
        console.log("vin imagini");
        setEmitCount((prevState) => prevState + 1);
        setVideoSrc(data.data);
      } else {
        console.error("Invalid data URI received");
      }
    });

    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Helper function to capture frame from video tag
  function captureVideoFrame(video, format, quality) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUri = canvas.toDataURL("image/jpeg" + format, quality);
    const data = dataUri.split(",")[1];
    const mimeType = dataUri.split(";")[0].slice(5);

    const bytes = window.atob(data);
    const buf = new ArrayBuffer(bytes.length);
    const arr = new Uint8Array(buf);

    for (let i = 0; i < bytes.length; i++) {
      arr[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([arr], { type: mimeType });
    return { blob: blob, dataUri: dataUri };
  }

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <img src={videoSrc} alt="Video Stream" />
      {emitCount} {sendCount}
    </div>
  );
};

export default VideoComponent;
