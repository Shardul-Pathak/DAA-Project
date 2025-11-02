export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultNode(name) {
  return { id: uid("n"), name };
}

// Node management
export function addNode(nodes) {
  return [...nodes, defaultNode(`Warehouse ${nodes.length + 1}`)];
}

export function removeNode(nodes, nodeId) {
  return nodes.filter((n) => n.id !== nodeId);
}

export function updateNodeName(nodes, nodeId, name) {
  return nodes.map((n) => (n.id === nodeId ? { ...n, name } : n));
}

// Edge management
export function setEdge(edges, fromNodeId, toNodeId, distance) {
  const key = `${fromNodeId}->${toNodeId}`;
  return { ...edges, [key]: { fromNodeId, toNodeId, distance: +distance } };
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

// Solver
export async function solveTSP(warehouses, edges) {
  const nodes = warehouses.map((n) => ({ id: n.id, name: n.name }));
  const nodeMap = {};
  nodes.forEach((node, i) => (nodeMap[node.id] = i));

  const n = nodes.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(Infinity));

  Object.values(edges).forEach((edge) => {
    const fromIdx = nodeMap[edge.fromNodeId];
    const toIdx = nodeMap[edge.toNodeId];
    if (fromIdx === undefined || toIdx === undefined) return;
    const distance = Number(edge.distance);
    matrix[fromIdx][toIdx] = distance;
    matrix[toIdx][fromIdx] = distance;
  });

  const safeMatrix = matrix.map((row) => row.map((v) => (v === Infinity ? 1e9 : v)));

  const payload = { nodes, matrix: safeMatrix };

  try {
    const response = await fetch("http://localhost:3000/report/getTSPReport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error solving TSP:", err);
    return null;
  }
}
