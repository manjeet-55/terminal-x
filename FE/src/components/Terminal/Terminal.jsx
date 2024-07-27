// TerminalComponent.js
import { useEffect, useRef, useState } from "react";
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
  const socketRef = useRef(null);
  const terminalRef = useRef(null);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyA39ik2y8b7EePKyUhiseX7EavMMMaNrg0"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:6060");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      if (terminalRef.current) {
        terminalRef.current.write(event.data);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      // call Gemini Api to get a response
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
      console.log(response.candidates[0].content.parts[0].text);
      // add Gemeni's response to the chat history
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

  useEffect(() => {
    const term = new Terminal({ cursorBlink: true });
    term.open(document.getElementById("terminal"));
    terminalRef.current = term;

    const sendToSocket = (message) => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(message);
      } else {
        console.error("WebSocket is not open. Message not sent:", message);
      }
    };

    term.onKey((keyObj) => {
      const { key } = keyObj;
      sendToSocket(key);
    });

    term.onResize(({ cols, rows }) => {
      sendToSocket(`resize ${cols} ${rows}`);
    });

    term.write(
      "                                  " + "Welcome to terminalX!\r\n"
    );

    return () => {
      term.dispose();
    };
  }, []);

  const handleEnter = (command) => {
    //setUserInput(command);
    const formattedCommand = command; // Append newline to the command
    sendToSocket(formattedCommand); // Send command to socket
    sendMessage();
  };

  const sendToSocket = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error("WebSocket is not open. Message not sent:", message);
    }
  };

  return (
    <div className="h-full w-full">
  <div className="h-full flex w-full">
    <div className="w-[30%] flex flex-col bg-blue-100 m-2 rounded-xl p-2">
      <div className="m-2 ">
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
          className="mt-4 block px-4 py-2 rounded-lg bg-red-400 text-white hover:bg-red-500 focus:outline-none"
          onClick={clearChat}
        >
          Clear Chat
        </button>
        </div>
      </div>
      <div className="m-4 p-2">
        <ChatHistory chatHistory={chatHistory} />
      </div>
    </div>
    <div className="flex flex-col items-center w-[100%]  ml-10 pl-4 pt-4 ">
      <div id="terminal" className="w-[90%] rounded-xl slelct-none"></div>
      <InputBox onEnter={handleEnter} />
    </div>
    <div className="w-[30%] bg-[#1f1514]">
      <Workspace />
    </div>
  </div>
</div>

  );
};

export default TerminalComponent;
