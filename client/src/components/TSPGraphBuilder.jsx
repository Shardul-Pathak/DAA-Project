import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as graphUtils from "../utils/TSPGraphUtils";

export default function TSPGraphBuilder( { setReport } ) {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([
    graphUtils.defaultNode("Warehouse 1"),
    graphUtils.defaultNode("Warehouse 2"),
  ]);
  const [edges, setEdges] = useState({});
  
  const handleAddWarehouse = () => setWarehouses(graphUtils.addNode(warehouses));
  const handleRemoveWarehouse = (id) =>
    setWarehouses(graphUtils.removeNode(warehouses, id));
  const handleUpdateWarehouseName = (id, name) =>
    setWarehouses(graphUtils.updateNodeName(warehouses, id, name));
  
  const handleSetEdge = (fromId, toId, distance) =>
    setEdges(graphUtils.setEdge(edges, fromId, toId, distance));

  const handleRemoveEdge = (fromId, toId) =>
    setEdges(graphUtils.removeEdge(edges, fromId, toId));

  const handleSolveTSP = async () => {
  const result = await graphUtils.solveTSP(warehouses, edges);
  if (!result) return alert("No valid route found!");
  const report = {
    type: "TSP",
    generatedAt: new Date().toLocaleString(),
    totalCost: result.totalCost,
    bestPath: result.bestPath,
    legDetails: result.legDetails,
  }
  setReport(report);
  navigate("/report", {state: {report}});
};

  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-6 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-400 text-center">
        Travelling Salesman Problem (TSP) — Warehouse Route Optimizer
      </h1>

      <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
        {/* Warehouse List */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-4 md:p-5 border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-300 mb-3">Warehouses</h2>
          <ul className="space-y-2">
            {warehouses.map((wh) => (
              <li
                key={wh.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700 p-2 rounded-lg border border-gray-600 gap-2 sm:gap-2"
              >
                <input
                  value={wh.name}
                  onChange={(e) => handleUpdateWarehouseName(wh.id, e.target.value)}
                  className="bg-gray-800 text-gray-100 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemoveWarehouse(wh.id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-400 rounded text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleAddWarehouse}
            className="mt-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
          >
            + Add Warehouse
          </button>
        </div>

        {/* Distances */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-4 md:p-5 border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-300 mb-3">
            Distances Between Warehouses
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-gray-700 text-left text-gray-400">
                    From \ To
                  </th>
                  {warehouses.map((to) => (
                    <th key={to.id} className="p-2 border border-gray-700 text-gray-300">
                      {to.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {warehouses.map((from) => (
                  <tr key={from.id}>
                    <td className="p-2 border border-gray-700 text-gray-300 font-medium">
                      {from.name}
                    </td>
                    {warehouses.map((to) => {
                      if (from.id === to.id)
                        return (
                          <td
                            key={to.id}
                            className="p-2 border border-gray-700 text-gray-600 text-center"
                          >
                            —
                          </td>
                        );
                      const e = graphUtils.getEdge(edges, from.id, to.id);
                      return (
                        <td key={to.id} className="p-2 border border-gray-700 text-center">
                          <input
                            type="number"
                            min="0"
                            value={e?.distance ?? ""}
                            placeholder="Distance"
                            onChange={(ev) =>
                              handleSetEdge(from.id, to.id, Number(ev.target.value) || 0)
                            }
                            className="w-20 bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-gray-100 focus:ring-blue-500 focus:outline-none"
                          />
                          {e && (
                            <button
                              onClick={() => handleRemoveEdge(from.id, to.id)}
                              className="ml-2 text-red-400 hover:text-red-300"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSolveTSP}
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
          >
            🧭 Compute Optimal Warehouse Route
          </button>
        </div>
      </div>
    </div>
  );
}
