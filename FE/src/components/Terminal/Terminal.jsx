import React, { useState } from "react";
import InputBox from "./InputBox/InputBox";
import Workspace from "../WorkSpace/Workspace";
import ChatHistory from "../ChatHistory/index";
import Button from "../Button";
import Navbar from "../Navbar/Navbar";
import { AiOutlineClose } from "react-icons/ai";
import useTerminal from "./hooks/useTerminal";
import "./Terminal.css";
import { useDispatch } from "react-redux";
import { addProcesses } from "../../../store/slices/processSlice";

const TerminalComponent = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);

  const {
    terminals,
    currentTerminal,
    createTerminal,
    sendToSocket,
    closeTerminal,
    setCurrentTerminal,
    terminalOutputs,
    setTerminalOutputs
  } = useTerminal("ws://localhost:6060", "terminal");

  const dispatch = useDispatch();
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const parseTerminalOutput = (output) => {
    // Split the output into lines
    const lines = output.trim().split("\n");
  
    // Extract header and rows
    const header = lines[0].split(/\s+/).filter(Boolean);
    const rows = lines.slice(1).map(line => {
      const cells = line.split(/\s+/).filter(Boolean);
      return header.reduce((acc, key, index) => {
        acc[key] = cells[index] || "";
        return acc;
      }, {});
    });
  
    return rows; // This will be an array of objects
  };

  const handleEnter = (command) => {
   
   const processes=   parseTerminalOutput(terminalOutputs[currentTerminal])
   console.log("processes",processes)
   dispatch(addProcesses(processes))
    if (currentTerminal !== null) {
      const formattedCommand = command;
      const message = JSON.stringify({
        terminalId: currentTerminal,  
        command: formattedCommand,
      });

      sendToSocket(message);

      const newCommandHistory = [
        ...commandHistory,
        { command: formattedCommand, timestamp: new Date().toISOString() },
      ];
      setCommandHistory(newCommandHistory);
      localStorage.setItem("commandHistory", JSON.stringify(newCommandHistory));
    }
    setTerminalOutputs([currentTerminal]);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const handleCopyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  const switchTerminal = (index) => {
    setCurrentTerminal(index);
  };

  return (
    <div className="h-full w-full flex flex-col">
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
                onClick={() => handleEnter(userInput)}
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
            className={`py-1 h-7 flex justify-center items-center rounded-lg bg-gray-600 text-white hover:bg-transparent hover:text-blue-600 hover:border-blue-600 ${
              terminals.length >= 7 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={terminals.length < 7 ? createTerminal : undefined}
            disabled={terminals.length >= 7}
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
          <InputBox onSend={handleEnter}  />
        </div>
        <div className="w-[30%] bg-[#1f1514]">
          <Workspace />
        </div>
      </div>
    </div>
  );
};

export default TerminalComponent;
