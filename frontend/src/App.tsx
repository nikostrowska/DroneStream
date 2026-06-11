import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/HomePage";
import MyFleet from "./pages/MyFleet";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/signup";


  return (
    <div
      className="flex h-screen w-screen overflow-hidden flex-col"
      style={{ backgroundColor: isAuth ? "transparent" : "#BEBABA" }}
    >
      {!isAuth && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myfleet" element={<MyFleet />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;