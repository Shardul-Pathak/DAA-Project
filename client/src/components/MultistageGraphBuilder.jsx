import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as graphUtils from "../utils/MultistageGraphUtils.js";

export default function MultistageGraphBuilder({ setReport }) {
  const navigate = useNavigate();
  const [stages, setStages] = useState([
    { id: graphUtils.uid("s"), name: "Source (Factory)", nodes: [graphUtils.defaultNode("Factory")] },
    { id: graphUtils.uid("s"), name: "Destination", nodes: [graphUtils.defaultNode("Destination")] },
  ]);
  const [edges, setEdgesState] = useState({});

  const handleAddStage = (afterIndex) => setStages(graphUtils.addStage(stages, afterIndex));
  const handleRemoveStage = (index) => {
    const newStages = graphUtils.removeStage(stages, index);
    if (newStages === stages) return alert("Need at least source and destination.");
    setStages(newStages);
  };
  const handleUpdateStageName = (index, name) =>
    setStages(graphUtils.updateStageName(stages, index, name));
  const handleAddNode = (stageIndex) => setStages(graphUtils.addNode(stages, stageIndex));
  const handleRemoveNode = (stageIndex, nodeId) =>
    setStages(graphUtils.removeNode(stages, stageIndex, nodeId));
  const handleUpdateNodeName = (stageIndex, nodeId, name) =>
    setStages(graphUtils.updateNodeName(stages, stageIndex, nodeId, name));
  const handleSetEdge = (fromNodeId, toNodeId, distance, quality) =>
    setEdgesState(graphUtils.setEdge(edges, fromNodeId, toNodeId, distance, quality));
  const handleRemoveEdge = (fromNodeId, toNodeId) =>
    setEdgesState(graphUtils.removeEdge(edges, fromNodeId, toNodeId));
  const handleSolveMS = async () => {
    const result = await graphUtils.solveMS(stages, edges);
    if (!result) return alert("No valid route found!");
    const report = {
      type: "Multistage",
      generatedAt: new Date().toLocaleString(),
      totalCost: result.totalCost,
      bestPath: result.bestPath,
      stageDetails: result.stageDetails,
      matrix: result.matrix,
    }
    setReport(report);
  
    navigate("/report", {state: {report}});
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-6 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-400 text-center">
        Multistage — Warehouse Route Optimizer
      </h1>

      <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto">
        {stages.map((stage, sIdx) => (
          <div
            key={stage.id}
            className="bg-gray-800 rounded-2xl shadow-lg p-4 md:p-5 border border-gray-700"
          >
            {/* Stage Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 w-full sm:w-auto">
                <input
                  value={stage.name}
                  onChange={(e) => handleUpdateStageName(sIdx, e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-lg text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                />
                <span className="text-sm text-gray-400">(Stage {sIdx})</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleAddNode(sIdx)}
                  className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-500 text-sm sm:text-base"
                >
                  + Node
                </button>
                {sIdx !== 0 && sIdx !== stages.length - 1 && (
                  <button
                    onClick={() => handleRemoveStage(sIdx)}
                    className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-500 text-sm sm:text-base"
                  >
                    Remove Stage
                  </button>
                )}
              </div>
            </div>

            {/* Nodes and Edges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Nodes */}
              <div>
                <h2 className="text-lg font-semibold mb-2 text-blue-300">Nodes</h2>
                <ul className="space-y-2">
                  {stage.nodes.map((node) => (
                    <li
                      key={node.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700 p-2 rounded-lg border border-gray-600 gap-2 sm:gap-2"
                    >
                      <input
                        value={node.name}
                        onChange={(e) =>
                          handleUpdateNodeName(sIdx, node.id, e.target.value)
                        }
                        className="bg-gray-800 text-gray-100 rounded px-2 py-1 flex-1 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleRemoveNode(sIdx, node.id)}
                        className="px-2 py-1 bg-red-500 hover:bg-red-400 rounded text-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Edges */}
              <div>
                <h2 className="text-lg font-semibold mb-2 text-blue-300">
                  Edges (from previous stage)
                </h2>
                {sIdx === 0 ? (
                  <div className="text-gray-500 text-sm">
                    No edges — this is the source stage.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stage.nodes.map((toNode) => (
                      <div
                        key={toNode.id}
                        className="bg-gray-700 p-3 rounded-lg border border-gray-600"
                      >
                        <div className="font-medium text-blue-200 mb-2">
                          To: {toNode.name}
                        </div>
                        {stages[sIdx - 1].nodes.map((fromNode) => {
                          const e = graphUtils.getEdge(edges, fromNode.id, toNode.id);
                          return (
                            <div
                              key={fromNode.id}
                              className="flex flex-wrap gap-2 items-center mb-2 text-sm"
                            >
                              <span className="text-gray-400 w-full sm:w-36">
                                From: {fromNode.name}
                              </span>
                              <input
                                type="number"
                                min="0"
                                placeholder="Distance"
                                value={e?.distance ?? ""}
                                onChange={(ev) =>
                                  handleSetEdge(
                                    fromNode.id,
                                    toNode.id,
                                    ev.target.value || 0,
                                    e?.quality ?? 5
                                  )
                                }
                                className="w-full sm:w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-100 focus:ring-blue-500 focus:outline-none"
                              />
                              <input
                                type="number"
                                min="1"
                                max="10"
                                placeholder="Quality (1-10)"
                                value={e?.quality ?? ""}
                                onChange={(ev) =>
                                  handleSetEdge(
                                    fromNode.id,
                                    toNode.id,
                                    e?.distance ?? 1,
                                    ev.target.value || 1
                                  )
                                }
                                className="w-full sm:w-28 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-100 focus:ring-blue-500 focus:outline-none"
                              />
                              {e && (
                                <button
                                  onClick={() =>
                                    handleRemoveEdge(fromNode.id, toNode.id)
                                  }
                                  className="px-2 py-1 bg-red-500 rounded hover:bg-red-400 w-full sm:w-auto"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => handleAddStage(stages.length - 1)}
            className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-500"
          >
            + Add Stage
          </button>
          <button
            onClick={handleSolveMS}
            className="px-5 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
          >
            🧭 Find Shortest Path
          </button>
        </div>
      </div>
    </div>
  );
}

