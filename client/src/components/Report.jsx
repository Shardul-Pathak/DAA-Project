import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Report({ reportData }) {
  const getQualityColor = (quality) => {
    if (quality <= 4) return "text-red-400";
    if (quality <= 7) return "text-yellow-400";
    return "text-green-400";
  };

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <h2 className="text-2xl font-semibold text-blue-400 mb-2">
          No Report Available
        </h2>
        <a
          href="/"
          className="mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
        >
          🧭 Go to Optimizer
        </a>
      </div>
    );
  }
  const isTSP = reportData.type === "TSP";
  const chartData = isTSP
    ? reportData.legDetails?.map((l, i) => ({
        stage: `Leg ${i + 1}`,
        cost: l.cost,
      }))
    : reportData.stageDetails?.map((s, i) => ({
        stage: `Stage ${i + 1}`,
        cost: s.cost,
        quality: s.quality,
      })) || [];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-700 pb-3">
          <h1 className="text-2xl font-bold text-blue-400">
            {isTSP
              ? "Travelling Warehouse (TSP) Report"
              : "Multistage Warehouse Optimization Report"}
          </h1>
        </header>

        {/* Generation Time */}
        <div className="text-gray-400 text-sm">
          Generated:{" "}
          <span className="text-gray-300">{reportData.generatedAt}</span>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700">
          {isTSP ? (
            <>
              <p>
                <span className="font-semibold text-gray-300">
                  Total Distance:
                </span>{" "}
                {reportData.totalCost} units
              </p>
              <p>
                <span className="font-semibold text-gray-300">Route:</span>{" "}
                {reportData.bestPath.join(" → ")}
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold text-gray-300">Total Cost:</span>{" "}
                {reportData.totalCost} units
              </p>
              <p>
                <span className="font-semibold text-gray-300">Best Path:</span>{" "}
                {reportData.bestPath.join(" → ")}
              </p>
            </>
          )}
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">
            {isTSP ? "Route Breakdown" : "Stage Breakdown"}
          </h3>
          <ul className="space-y-2">
            {(isTSP ? reportData.legDetails : reportData.stageDetails)?.map(
              (s, i) => (
                <li
                  key={i}
                  className="border-b border-gray-700 pb-2 text-gray-300"
                >
                  <strong>{isTSP ? `Leg ${i + 1}:` : `Stage ${i + 1}:`}</strong>{" "}
                  {s.from} → {s.to} |{" "}
                  {isTSP ? (
                    <>
                      Distance:{" "}
                      <span className="text-green-400">{s.cost}</span> units
                    </>
                  ) : (
                    <>
                      Distance:{" "}
                      <span className="text-green-400">{s.distance}</span> | Quality:{" "}
                      <span className={getQualityColor(s.quality)}>{s.quality}</span>
                    </>
                  )}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Chart Visualization */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">
            {isTSP ? "Distance per Leg" : "Cost per Stage"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="stage" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #555",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke={isTSP ? "#4ade80" : "#60a5fa"}
                strokeWidth={2}
              />
              {!isTSP && (
                <Line
                  type="monotone"
                  dataKey="quality"
                  stroke="#facc15"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-medium"
          >
            🔙 Back to Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
