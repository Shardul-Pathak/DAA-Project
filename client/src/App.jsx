import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MultistageGraphBuilder from "./components/MultistageGraphBuilder.jsx";
import TSPGraphBuilder from "./components/TSPGraphBuilder.jsx";
import Report from "./components/Report.jsx";

function AppContent() {
  const [mode, setMode] = useState("multistage");
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  const toggleMode = () => {
    setMode((prev) => (prev === "multistage" ? "tsp" : "multistage"));
    navigate("/"); // 👈 redirect immediately after toggle
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <header className="flex flex-col sm:flex-row justify-between items-center bg-gray-900 border-b border-gray-700 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400">
          Graph Optimization Dashboard
        </h1>

        <div className="mt-2 sm:mt-0 flex items-center gap-3">
          <span className="text-gray-400 text-sm sm:text-base">
            Mode:{" "}
            <span className="text-blue-300 font-medium capitalize">
              {mode === "multistage" ? "Multistage" : "TSP"}
            </span>
          </span>

          <button
            onClick={toggleMode}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm sm:text-base font-medium transition-all"
          >
            Switch to {mode === "multistage" ? "TSP" : "Multistage"}
          </button>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            mode === "multistage" ? (
              <MultistageGraphBuilder setReport={setReport} />
            ) : (
              <TSPGraphBuilder setReport={setReport} />
            )
          }
        />
        <Route
          path="/graphbuilder"
          element={
            mode === "multistage" ? (
              <MultistageGraphBuilder setReport={setReport} />
            ) : (
              <TSPGraphBuilder setReport={setReport} />
            )
          }
        />
        <Route path="/report" element={<Report reportData={report} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
