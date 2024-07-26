import "./App.css";
import TerminalComponent from "./components/Terminal/Terminal";
import Navbar from "./components/Navbar/Navbar";
// import UserProfile from "./components/UserProfile";
// import Workspace from "./components/Workspace";

function App() {
  return (
    <>
      <div className="w-screen h-screen flex flex-col">
        <Navbar />
        <div className="overflow-auto flex-1">
          <TerminalComponent />
        </div>
      </div>
    </>
  );
}

export default App;
