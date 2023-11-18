import React, { useEffect, useRef, useState } from "react";

function TestWs(props) {
  const wsRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("");

  const googleApi =
    "wss://fast-api-405217.lm.r.appspot.com/check_ws_connection";
  const carabetApi = "ws://16.171.64.238:5000/ws-fast";

  const connectWebSocket = () => {
    wsRef.current = new WebSocket(carabetApi);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      setConnectionStatus("Opened");
    };

    wsRef.current.onmessage = (message) => {
      console.log(message);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("Closed");
    };
  };

  const handleButtonClick = () => {
    connectWebSocket();
  };

  return (
    <div>
      <div>
        <b>{connectionStatus}</b>
      </div>
      <button onClick={handleButtonClick}>Testeaza Conexiunea</button>
    </div>
  );
}

export default TestWs;
