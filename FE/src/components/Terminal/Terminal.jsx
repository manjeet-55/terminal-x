import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import InputBox from "./InputBox/InputBox";
import Workspace from "../WorkSpace/Workspace";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../ChatHistory/index";
import "./Terminal.css";

const TerminalComponent = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);

  const [terminals, setTerminals] = useState([]);
  const [currentTerminal, setCurrentTerminal] = useState(null);
  
  const [queuedCommands, setQueuedCommands] = useState([]);
  const socketRefs = useRef([]);
  const terminalRefs = useRef([]);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyA39ik2y8b7EePKyUhiseX7EavMMMaNrg0"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      let prompt = `
        ${userInput}
        Instructions:
        - If the input contains computer science coding commands, explain the command only.
        - If the input contains non-coding related topics or anything else, respond with "Can't process."
        - Do not include any symbols in the output.
        - If I ask for a command, provide only the command as a single word.
        - If I ask to explain a command, provide a detailed explanation of the command.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const createTerminal = () => {
    const term = new Terminal({ cursorBlink: true, cursorStyle: "bar" });
    const socket = new WebSocket("ws://localhost:6060");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      term.open(document.getElementById(`terminal-${terminals.length}`));
      term.write("Welcome to terminalX!\r\n");
      processQueuedCommands(terminals.length);
    };

    socket.onmessage = (event) => {
      term.write(event.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      } else {
        console.error("WebSocket is not open. Data not sent:", data);
      }
    });

    setTerminals((prev) => [...prev, { id: terminals.length, term, socket }]);
    setCurrentTerminal(terminals.length);
  };

  const handleEnter = (command) => {
    if (currentTerminal !== null) {
      const formattedCommand = command;

      // Include terminalId in the message
      const message = JSON.stringify({
        terminalId: currentTerminal,
        command: formattedCommand,
      });

      sendToSocket(message); // Send command to the correct terminal
      sendMessage(); // This might be for other purposes, ensure it's defined properly

      // Update command history
      const newCommandHistory = [
        ...commandHistory,
        { command: formattedCommand, timestamp: new Date().toISOString() },
      ];
      setCommandHistory(newCommandHistory);
      localStorage.setItem("commandHistory", JSON.stringify(newCommandHistory));
    }
  };
  
  
  const queueCommand = (command, terminalId) => {
    setQueuedCommands((prev) => [...prev, { command, terminalId }]);
  };

  const processQueuedCommands = (terminalId) => {
    setQueuedCommands((prev) => {
      const newQueue = [];
      for (const item of prev) {
        if (item.terminalId === terminalId) {
          const { socket } = terminals[terminalId];
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(item.command);
          } else {
            newQueue.push(item);
          }
        } else {
          newQueue.push(item);
        }
      }
      return newQueue;
    });
  };


  const sendToSocket = (message) => {
    if (currentTerminal !== null) {
      const { socket } = terminals[currentTerminal];
      if (socket && socket.readyState === WebSocket.OPEN) {
        // console.log(message)
        socket.send(message); // Send message with terminalId
      } else {
        console.error("WebSocket is not open. Message not sent:", message);
        queueCommand(message, currentTerminal); // Queue the command if the socket is not open
      }
    }
  };
  
  



  

  const handleCopyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };


  const switchTerminal = (index) => {
    setCurrentTerminal(index);
  };

  return (
    <div className="h-full w-full">
      <div className="h-full flex w-full">
        <div className="w-[30%] flex flex-col bg-slate-600 border-t border-t-gray-400 p-2">
          <div className="m-2">
            <input
              type="text"
              className="flex-grow px-4 w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={userInput}
              onChange={handleUserInput}
            />
            <div className="flex flex-row gap-3">
              <button
                className="px-3 mt-4 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                onClick={sendMessage}
                disabled={isLoading}
              >
                Send
              </button>
              <button
                className="mt-4 block px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none"
                onClick={clearChat}
              >
                Clear Chat
              </button>
            </div>
          </div>
          <div className="p-2">
            <ChatHistory chatHistory={chatHistory} />
          </div>
        </div>
        <div className="flex flex-col items-center w-[100%]">
          <div className="flex flex-row gap-x-4">
            <button
              className="mt-4 p-2 w-32 flex justify-center rounded-lg bg-gray-600 text-white hover:bg-gray-700 focus:outline-none text-lg font-[500] font-inter"
              onClick={createTerminal}
            >
              New Tab
            </button>
            {terminals.map((terminal, index) => (
              <button
                key={index}
                className={`mt-4 p-2 w-20 flex justify-center rounded-lg  text-lg font-[500] font-inter ${
                  currentTerminal === index ? "bg-blue-500" : "bg-gray-600"
                } text-white hover:bg-blue-500 focus:outline-none`}
                onClick={() => switchTerminal(index)}
              >
                Tab {index + 1}
              </button>
            ))}
          </div>
          {terminals.map((terminal, index) => (
            <div
              key={index}
              id={`terminal-${index}`}
              className={`terminal-container w-full ${currentTerminal === index ? "" : "hidden"}`}
            ></div>
          ))}
          <InputBox onSend={handleEnter} />
         
        </div>
        <div className="w-[30%] bg-[#1f1514]">
          <Workspace />
        </div>
      </div>

      {/* History Popup */}
     
    </div>
  );
};

export default TerminalComponent;
