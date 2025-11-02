export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultNode(name) {
  return { id: uid("n"), name };
}

// Stage functions
export function addStage(stages, afterIndex = stages.length - 1) {
  const newStage = {
    id: uid("s"),
    name: `Stage ${stages.length}`,
    nodes: [defaultNode(`Node-${stages.length}-1`)],
  };
  const copy = [...stages];
  copy.splice(afterIndex, 0, newStage);
  return copy;
}

export function removeStage(stages, index) {
  if (stages.length <= 2) return stages;
  const copy = [...stages];
  copy.splice(index, 1);
  return copy;
}

export function updateStageName(stages, index, name) {
  const copy = [...stages];
  copy[index].name = name;
  return copy;
}

// Node functions
export function addNode(stages, stageIndex) {
  const copy = stages.map((s) => ({ ...s, nodes: [...s.nodes] }));
  copy[stageIndex].nodes.push(
    defaultNode(`Node-${stageIndex}-${copy[stageIndex].nodes.length + 1}`)
  );
  return copy;
}

export function removeNode(stages, stageIndex, nodeId) {
  const copy = stages.map((s) => ({ ...s, nodes: [...s.nodes] }));
  copy[stageIndex].nodes = copy[stageIndex].nodes.filter((n) => n.id !== nodeId);
  return copy;
}

export function updateNodeName(stages, stageIndex, nodeId, name) {
  const copy = stages.map((s) => ({ ...s, nodes: [...s.nodes] }));
  copy[stageIndex].nodes = copy[stageIndex].nodes.map((n) =>
    n.id === nodeId ? { ...n, name } : n
  );
  return copy;
}

// Edge functions
export function setEdge(edges, fromNodeId, toNodeId, distance, quality) {
  const key = `${fromNodeId}->${toNodeId}`;
  const newEdges = { ...edges };
  newEdges[key] = { fromNodeId, toNodeId, distance: +distance, quality: +quality };
  return newEdges;
}

export function removeEdge(edges, fromNodeId, toNodeId) {
  const key = `${fromNodeId}->${toNodeId}`;
  const newEdges = { ...edges };
  delete newEdges[key];
  return newEdges;
}

export function getEdge(edges, fromNodeId, toNodeId) {
  return edges[`${fromNodeId}->${toNodeId}`] || null;
}

// Solver function
export async function solveMS(stagesInput, edges) {
  const nodes = stagesInput.flatMap((stage) =>
    stage.nodes.map((n) => ({ id: n.id, name: n.name }))
  );

  const nodeMap = {};
  nodes.forEach((node, i) => (nodeMap[node.id] = i));

  const stages = stagesInput.map((stage) => stage.nodes.map((n) => n.id));

  const N = nodes.length;
  const matrix = Array.from({ length: N }, () => Array(N).fill(Infinity));

  Object.values(edges).forEach((edge) => {
    const fromIdx = nodeMap[edge.fromNodeId];
    const toIdx = nodeMap[edge.toNodeId];

    if (fromIdx === undefined || toIdx === undefined) return;

    const distance = Number(edge.distance);
    const quality = Number(edge.quality);
    const weight =
      distance > 0 && quality > 0 ? distance / quality : Infinity;

    matrix[fromIdx][toIdx] = weight;
    matrix[toIdx][fromIdx] = weight;
  });

  const safeMatrix = matrix.map((row) =>
    row.map((v) => (v === Infinity ? 1e9 : v))
  );

  const payload = {
    nodes,
    stages,
    matrix: safeMatrix,
  };

  try {
    const response = await fetch("http://localhost:3000/report/getMSReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error (${response.status}): ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error solving multistage:", error);
    throw error;
  }
}

