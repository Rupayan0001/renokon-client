import { useState, useEffect } from "react";

const socket = new WebSocket("ws://localhost:8080");

const Lobby = () => {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("Waiting...");

  const joinGame = () => {
    socket.send(JSON.stringify({ type: "joinGame", userId: "user123", topic }));
  };

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "startGame") {
        setStatus(`Game started in topic: ${data.topic}`);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Join a Quiz</h1>
      <input type="text" className="mt-4 p-2 text-black" placeholder="Enter Topic" onChange={(e) => setTopic(e.target.value)} />
      <button onClick={joinGame} className="mt-4 px-6 py-2 bg-blue-500 rounded-lg">
        Start Matchmaking
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
};

export default Lobby;
