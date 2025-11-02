import express from 'express';
import solveMultistageGraph  from '../utils/solveMultistageGraph.js';
import solveTSPGraph from '../utils/solveTSPGraph.js'

const router = express.Router();

router.post("/getMSReport", (req, res) => {
  try {
    const { nodes, stages, matrix } = req.body;

    if (!nodes || !matrix) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const result = solveMultistageGraph(matrix, stages, nodes);

    const report = {
      type: "Multistage",
      totalCost: result.totalCost.toFixed(2),
      bestPath: result.bestPath,
      stageDetails: result.stageDetails,
    };

    res.json(report);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.post("/getTSPReport", (req, res) => {
  try {
    const { nodes, matrix } = req.body;
    if (!nodes || !matrix) return res.status(400).json({ error: "Invalid input" });

    const result = solveTSPGraph(matrix, nodes);

    const report = {
      type: "TSP",
      totalCost: result.totalCost.toFixed(2),
      bestPath: result.bestPath,
      legDetails: result.legDetails,
    };

    res.json(report);
  } catch (err) {
    console.error("Error generating TSP report:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

export default router;