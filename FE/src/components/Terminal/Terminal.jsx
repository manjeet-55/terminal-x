// src/components/TerminalComponent.js
import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import InputBox from "./InputBox/InputBox";
import Workspace from "../WorkSpace/Workspace";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../ChatHistory/index";
import "./Terminal.css";
import Button from "../Button";
import Navbar from "../Navbar/Navbar";
import { AiOutlineClose } from "react-icons/ai";

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

  useEffect(() => {
    createTerminal();
  }, []);

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
    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      scrollback: 1000,
      rows: 20,
      cols: 80,
      fontSize: 14,
      fontFamily: "Monaco, monospace",
      theme: {
        background: "#1e1e1e",
        foreground: "#dcdcdc",
      },
      allowProposedApi: true,
      bellStyle: "sound",
      lineHeight: 1.5,
    });

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
      const message = JSON.stringify({
        terminalId: currentTerminal,
        command: formattedCommand,
      });

      sendToSocket(message);
      sendMessage();

      const newCommandHistory = [
        ...commandHistory,
        { command: formattedCommand, timestamp: new Date().toISOString() },
      ];
      setCommandHistory(newCommandHistory);
      localStorage.setItem("commandHistory", JSON.stringify(newCommandHistory));
    }
  };

  const closeTerminal = (index) => {
    setTerminals((prev) => prev.filter((_, i) => i !== index));

    if (currentTerminal === index) {
      setCurrentTerminal(index > 0 ? index - 1 : 0);
    } else if (currentTerminal > index) {
      setCurrentTerminal(currentTerminal - 1);
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
        socket.send(message);
      } else {
        console.error("WebSocket is not open. Message not sent:", message);
        queueCommand(message, currentTerminal);
      }
    }
  };

  const handleCopyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  const switchTerminal = (index) => {
    setCurrentTerminal(index);
  };

  // Function to send a sequence of commands to the current terminal
  const sendCommandsSequence = () => {
    if (currentTerminal !== null) {
      const commands = ["ls", "cd Documents", "mkdir NewFolder", "ls -l"];

      commands.forEach((command, index) => {
        setTimeout(() => {
          const commandMessage = JSON.stringify({
            terminalId: currentTerminal,
            command: command,
          });

          sendToSocket(commandMessage);
        }, index * 1000); // Delay each command by 1 second
      });
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <Navbar onStoreClick={sendCommandsSequence} />
      <div className="flex flex-row h-full w-full">
        <div className="w-[30%] flex flex-col bg-slate-600 border-t border-t-gray-400 p-2 border-r-[1px] border-white">
          <div className="m-2">
            <input
              type="text"
              className="flex-grow px-4 w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={userInput}
              onChange={handleUserInput}
            />
            <div className="flex flex-row gap-3 w-full">
              <Button
                onClick={sendMessage}
                disabled={isLoading}
                variant="primary"
              >
                Send
              </Button>
              <Button onClick={clearChat} variant="secondary">
                Clear
              </Button>
            </div>
          </div>
          <div className="p-2">
            <ChatHistory chatHistory={chatHistory} />
          </div>
        </div>
        <div className="flex flex-col items-center w-[70%]">
          <div className="flex items-center h-8 gap-x-2">
            <Button
              variant="primary"
              className="py-1 h-7 flex justify-center items-center rounded-lg bg-gray-600 text-white hover:bg-gray-800 hover:text-gray-100 hover:border-transparent"
              onClick={createTerminal}
            >
              New Tab
            </Button>

            {terminals.map((terminal, index) => (
              <Button
                key={index}
                className={`relative h-7 flex items-center justify-center gap-x-2 ${
                  currentTerminal === index ? "bg-blue-500" : "bg-gray-600"
                }`}
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  switchTerminal(index);
                }}
              >
                <span>Tab {index + 1}</span>
                {index !== 0 && (
                  <AiOutlineClose
                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 cursor-pointer text-red-600"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      closeTerminal(index);
                    }}
                    size={16} 
                  />
                )}
              </Button>
            ))}
          </div>
          {terminals.map((terminal, index) => (
            <div
              key={index}
              id={`terminal-${index}`}
              className={`terminal-container w-full ${
                currentTerminal === index ? "" : "hidden"
              }`}
            ></div>
          ))}
          <InputBox onSend={handleEnter} />
        </div>
        <div className="w-[30%] bg-[#1f1514]">
          <Workspace />
        </div>
      </div>
    </div>
  );
};

export default TerminalComponent;
