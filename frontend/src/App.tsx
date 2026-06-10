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
import { SignalRProvider } from "./components/signalRContext/SignalRProvider";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <SignalRProvider>
          <AppContent />
        </SignalRProvider>
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className={`flex h-screen w-screen overflow-hidden flex-col ${isLogin ? "bg-transparent" : "bg-page theme-transition"}`}>
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
