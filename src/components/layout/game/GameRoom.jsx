import { useState, useEffect } from "react";

const socket = new WebSocket("ws://localhost:8080");

const GameRoom = ({ roomId }) => {
  const [question, setQuestion] = useState("Waiting for question...");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "updateScores") {
        alert(`Answer submitted: ${data.answer}`);
      }
    };
  }, []);

  const submitAnswer = () => {
    socket.send(JSON.stringify({ type: "submitAnswer", roomId, answer }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Quiz Game</h1>
      <p className="mt-4">{question}</p>
      <input type="text" className="mt-4 p-2 text-black" placeholder="Your Answer" onChange={(e) => setAnswer(e.target.value)} />
      <button onClick={submitAnswer} className="mt-4 px-6 py-2 bg-green-500 rounded-lg">
        Submit Answer
      </button>
    </div>
  );
};

export default GameRoom;
