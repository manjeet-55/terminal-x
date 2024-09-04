import { useState, useEffect } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const useTerminal = (url, terminalContainerId) => {
  const [terminals, setTerminals] = useState([]);
  const [currentTerminal, setCurrentTerminal] = useState(null);
  const [queuedCommands, setQueuedCommands] = useState([]);
  const [terminalOutputs, setTerminalOutputs] = useState({});

  useEffect(() => {
    createTerminal();
  }, []);

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

    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      term.open(document.getElementById(`${terminalContainerId}-${terminals.length}`));
      term.write("Welcome to terminalX!\r\n");
      processQueuedCommands(terminals.length);
    };

    socket.onmessage = (event) => {
      term.write(event.data);
      setTerminalOutputs((prev) => ({
        ...prev,
        [terminals.length]: (prev[terminals.length] || '') + event.data,
      }));
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

  const closeTerminal = (index) => {
    setTerminals((prev) => prev.filter((_, i) => i !== index));

    if (currentTerminal === index) {
      setCurrentTerminal(index > 0 ? index - 1 : 0);
    } else if (currentTerminal > index) {
      setCurrentTerminal(currentTerminal - 1);
    }
  };

  return {
    terminals,
    currentTerminal,
    createTerminal,
    sendToSocket,
    closeTerminal,
    setCurrentTerminal,
    terminalOutputs,
    setTerminalOutputs
  };
};

export default useTerminal;
