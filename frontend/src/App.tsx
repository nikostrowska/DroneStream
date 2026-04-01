import { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import WidgetBar from "./components/widgets/WidgetBar";
import Stream from "./components/stream/Stream";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden bg-white flex-col">
        <Navbar />
        <div className="flex flex-1">
          <WidgetBar />

          <main className="flex-1 h-full bg-gray-100 flex items-center justify-center p-8 overflow-hidden">
            <Stream />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
