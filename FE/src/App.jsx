import "./App.css";
import TerminalComponent from "./components/Terminal/Terminal";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import Terminal from "./Pages/Terminal";
import { ProtectedRoute } from "./Pages/ProtectedRoute";
import SignUp from "./components/SignUp";
// import UserProfile from "./components/UserProfile";
// import Workspace from "./components/Workspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Terminal />} /> {/* Protected Terminal route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
