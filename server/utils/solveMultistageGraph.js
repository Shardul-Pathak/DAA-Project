export default function solveMultistageGraph(matrix, stages, nodes, edges = []) {
  const n = matrix.length;
  const cost = Array(n).fill(Infinity);
  const nextNode = Array(n).fill(null);
  cost[n - 1] = 0;

  for (let i = n - 2; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (matrix[i][j] < 1e9) {
        const newCost = matrix[i][j] + cost[j];
        if (newCost < cost[i]) {
          cost[i] = newCost;
          nextNode[i] = j;
        }
      }
    }
  }

  const path = [];
  let i = 0;
  while (i !== null && i < n) {
    path.push(i);
    i = nextNode[i];
  }

  const detailedStages = [];
  for (let k = 0; k < path.length - 1; k++) {
    const fromIdx = path[k];
    const toIdx = path[k + 1];
    const fromNode = nodes[fromIdx];
    const toNode = nodes[toIdx];

    const edge = edges.find(
      (e) =>
        (e.fromNodeId === fromNode.id && e.toNodeId === toNode.id) ||
        (e.fromNodeId === toNode.id && e.toNodeId === fromNode.id)
    );

    detailedStages.push({
      stage: k + 1,
      from: fromNode.name,
      to: toNode.name,
      distance: weight,
      quality: edge?.quality ?? 0,
    });
  }

  return {
    totalCost: cost[0],
    bestPath: path.map((i) => nodes[i].name),
    stageDetails: detailedStages,
  };
}
