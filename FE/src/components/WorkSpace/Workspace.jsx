import React, { useState } from "react";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider } from "@mui/material";

const initialWorkspaces = [
  { name: "Workspace 1", commands: [{ key: "cmd1", value: "Command 1" }] },
  { name: "Workspace 2", commands: [{ key: "cmd2", value: "Command 2" }] },
];

export default function RightSidebar() {
  const [openWorkspace, setOpenWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newCommand, setNewCommand] = useState({ key: "", value: "" });

  const handleWorkspaceClick = (index) => {
    setOpenWorkspace(openWorkspace === index ? null : index);
  };

  const handleAddWorkspace = () => {
    if (newWorkspaceName.trim() === "") return;

    const updatedWorkspaces = [
      ...workspaces,
      { name: newWorkspaceName, commands: [] },
    ];
    setWorkspaces(updatedWorkspaces);
    setNewWorkspaceName("");
  };

  const handleDeleteWorkspace = (index) => {
    const updatedWorkspaces = workspaces.filter((_, i) => i !== index);
    setWorkspaces(updatedWorkspaces);
    if (openWorkspace === index) {
      setOpenWorkspace(null);
    }
  };

  const handleAddCommand = (index) => {
    if (newCommand.key.trim() === "" || newCommand.value.trim() === "") return;

    const updatedWorkspaces = [...workspaces];
    updatedWorkspaces[index].commands.push(newCommand);
    setWorkspaces(updatedWorkspaces);
    setNewCommand({ key: "", value: "" });
  };

  const handleDeleteCommand = (workspaceIndex, commandIndex) => {
    const updatedWorkspaces = [...workspaces];
    updatedWorkspaces[workspaceIndex].commands = updatedWorkspaces[workspaceIndex].commands.filter((_, i) => i !== commandIndex);
    setWorkspaces(updatedWorkspaces);
  };

  const handleCopyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="w-full h-full border-l-4 border-white p-4 overflow-y-auto bg-gray-800 text-white">
      {/* Add Workspace Section */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="New Workspace Name"
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          className="p-2 bg-gray-900 border border-white rounded text-white outline-none"
        />
        <button
          onClick={handleAddWorkspace}
          className="p-1 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add Workspace
        </button>
      </div>

      {/* List of Workspaces */}
      { workspaces.map((workspace, index) => (
        <div key={index} className="mb-4">
          {/* Workspace Header */}
          <button
            onClick={() => handleWorkspaceClick(index)}
            className="w-full flex items-center justify-between p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            <span>{workspace.name}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteWorkspace(index)}
                className="text-red-500 hover:text-red-400"
              >
                <DeleteIcon />
              </button>
              <KeyboardArrowDown
                className={`transition-transform ${
                  openWorkspace === index ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Workspace Content */}
          {openWorkspace === index && (
            <div className="mt-2 pl-4">
              {/* Add Command Section */}
              <div className="flex items-center w-full justify-between pr-2 border-b border-white/60 mb-2">
                <div className="flex flex-col py-2 gap-y-1 w-[80%]">
                  <input
                    type="text"
                    placeholder="Enter new Command Key"
                    value={newCommand.key}
                    onChange={(e) =>
                      setNewCommand({ ...newCommand, key: e.target.value })
                    }
                    className="p-2 bg-gray-900 border border-white rounded text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Enter new Command Value"
                    value={newCommand.value}
                    onChange={(e) =>
                      setNewCommand({ ...newCommand, value: e.target.value })
                    }
                    className="p-2 bg-gray-900 border border-white rounded text-white outline-none"
                  />
                </div>
                <button
                  onClick={() => handleAddCommand(index)}
                  className="p-2 text-white bg-green-500 border border-white/60 rounded-lg hover:bg-green-600 flex items-center justify-center"
                >
                  <AddIcon />
                </button>
              </div>

              {/* List of Commands */}
              <div>
                {workspace.commands.map((command, commandIndex) => (
                  <div
                    key={command.key}
                    className="flex items-center justify-between p-2 py-4 border-b border-white/60 bg-gray-700 rounded"
                  >
                    <div className="flex items-center text-white/80 gap-x-3">
                      <span className="text-lg">{command.key}</span>
                      <span>|</span>
                      <span className="text-sm">{command.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyToClipboard(command.value)}
                        className="p-1 text-white/90 hover:text-white transition"
                      >
                        <ContentCopyIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteCommand(index, commandIndex)}
                        className="p-1 text-red-500 hover:text-red-400"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
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
