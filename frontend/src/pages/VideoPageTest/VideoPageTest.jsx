import React, { useEffect, useRef, useState } from 'react';
import style from './VideoPageTest.module.css'
import Navbar from "../../Components/Navbar/Navbar.jsx";
function VideoPageTest(props) {

    const videoRef = useRef(null);
    const wsRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState('');

    const [emitCount, setEmitCount] = useState(0);
    const [sendCount, setSendCount] = useState(0);
    const [results,setResults] = useState([])
    const carabetApi = "ws://16.171.64.238:5000/ws-fast"
    const localCV ="ws://127.0.0.1:8000/ws-fast"
    const localYOLO ="ws://127.0.0.1:8000/ws-yolo"
    const googleApi ="wss://fast-api-405217.lm.r.appspot.com/ws-fast"
    const parkingAPI = "ws://127.0.0.1:8000/ws-parking-update"
    const flaviusAPI = "ws://127.0.0.1:8000/video"

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

            })
            .catch(err => {
                console.error('Error accessing media devices.', err);
            });
    }, []);

    const handleConnect = () => {
        wsRef.current = new WebSocket(flaviusAPI);

        wsRef.current.onopen = () => {
            console.log('WebSocket connection opened');
            
            Y
        };

        wsRef.current.onmessage = (message) => {
            const temp = JSON.parse(message.data)
            
            setResults(temp)
            setEmitCount(prevState => prevState + 1);
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

    };

    const closeConnection = ()=>{

        location.reload()
    }

    // Helper function to capture frame from video tag
    function captureVideoFrame(video, format, quality) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUri = canvas.toDataURL('image/' + format, quality);
        const data = dataUri.split(',')[1];
        const mimeType = dataUri.split(';')[0].slice(5);

        const bytes = window.atob(data);
        const buf = new ArrayBuffer(bytes.length);
        const arr = new Uint8Array(buf);

        for (let i = 0; i < bytes.length; i++) {
            arr[i] = bytes.charCodeAt(i);
        }

        const blob = new Blob([arr], {type: mimeType});
        return {blob: blob, dataUri: dataUri};
    }

    const [showSendingVideo,setShowSendingVideo] = useState(false)


    return (
        <div>
            <Navbar/>
            <div className={style.wrapper}>

                {/* asta trimite */}
                <video ref={videoRef} autoPlay playsInline className={style.recievedVideo}/>
                <div className={style.recievedVideo}>
                    {/* asta primeste  */}
                    <img src={videoSrc} alt="Video Stream" style={{display: videoSrc ? 'block' : 'none'}} className={style.recievedVideo}/>
                </div>
                <div className={style.info}>
                    <div>Emit Count: {emitCount}</div>
                    <div>Send Count: {sendCount}</div>
                </div>
                <div className={style.info}>
                    {
                        wsRef.current ? (<button onClick={closeConnection} className={style.confirmBtn} > Close </button>) : (<button className={style.confirmBtn} onClick={handleConnect}>
                            Conecteaza
                        </button>)
                    }
                </div>

            </div>
        </div>
    );
}

export default VideoPageTest;