import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/HomePage";
import MyFleet from "./pages/MyFleet";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
      <div
        className="flex h-screen w-screen overflow-hidden flex-col"
        style={{ backgroundColor: isLogin ? "transparent" : "#BEBABA"}}
      >

        {!isLogin && <Navbar />}


        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myfleet" element={<MyFleet />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
  );
}

export default App;
