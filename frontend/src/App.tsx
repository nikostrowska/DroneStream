import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/HomePage";
import MyFleet from "./pages/MyFleet";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden bg-[#BEBABA] flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myfleet" element={<MyFleet />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
