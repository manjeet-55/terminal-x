import React, { useState } from "react";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Divider } from "@mui/material";

const initialWorkspaces = [
  { name: "Workspace 1", commands: [{ key: "cmd1", value: "Command 1" }] },
  { name: "Workspace 2", commands: [{ key: "cmd2", value: "Command 2" }] },
];

export default function RightSidebar() {
  const [openWorkspace, setOpenWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [newCommand, setNewCommand] = useState({ key: "", value: "" });

  const handleWorkspaceClick = (index) => {
    setOpenWorkspace(openWorkspace === index ? null : index);
  };

  const handleAddCommand = (index) => {
    const updatedWorkspaces = [...workspaces];
    updatedWorkspaces[index].commands.push(newCommand);
    setWorkspaces(updatedWorkspaces);
    setNewCommand({ key: "", value: "" });
  };

  const handleCopyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="w-full h-full border-l-4 border-white p-4 overflow-y-auto">
      {workspaces.map((workspace, index) => (
        <div key={workspace.name} className="mb-4">
          <button
            onClick={() => handleWorkspaceClick(index)}
            className="w-full flex items-center justify-between p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          >
            <span>{workspace.name}</span>
            <KeyboardArrowDown
              className={`transition-transform ${
                openWorkspace === index ? "rotate-180" : ""
              }`}
            />
          </button>
          {openWorkspace === index && (
            <div className="">
              <div className="flex items-center w-full justify-between pr-2 border-b border-white/60">
                <div className="flex flex-col py-2 gap-y-1 w-[80%]">
                  <input
                    type="text"
                    placeholder="Enter new Command Key"
                    value={newCommand.key}
                    onChange={(e) =>
                      setNewCommand({ ...newCommand, key: e.target.value })
                    }
                    className="p-1 text-white rounded mr-2 outline-none bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Enter new Command Value"
                    value={newCommand.value}
                    onChange={(e) =>
                      setNewCommand({ ...newCommand, value: e.target.value })
                    }
                    className="p-1 text-white rounded mr-2 outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => handleAddCommand(index)}
                  className="p-2 text-white border border-white/60 rounded-lg transition flex items-center justify-center"
                >
                  <AddIcon />
                </button>
              </div>

              <div className="">
                {workspace.commands.map((command) => (
                  <div
                    key={command.key}
                    className="flex items-center justify-between p-2  py-4 border-b border-white/60"
                  >
                    <div className="flex items-center text-white/80 gap-x-3">
                      <span className="text-lg">{command.key}</span>
                      <span>|</span>
                      <span className="text-sm">{command.value}</span>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(command.value)}
                      className="p-1 text-white/90 hover:text-white transition"
                    >
                      <ContentCopyIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
