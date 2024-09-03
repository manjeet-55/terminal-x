import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import TerminalComponent from "../../components/Terminal/Terminal";
const Terminal = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <div className="overflow-auto flex-1">
        <TerminalComponent />
      </div>
    </div>
  );
};

export default Terminal;
