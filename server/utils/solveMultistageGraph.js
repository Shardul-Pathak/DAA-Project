export default function solveMultistageGraph(matrix, stages, nodes) {
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
    const from = nodes[path[k]];
    const to = nodes[path[k + 1]];
    const weight = matrix[path[k]][path[k + 1]];
    detailedStages.push({
      stage: k + 1,
      from: from.name,
      to: to.name,
      cost: weight,
      quality: (1 / weight) * 100,
    });
  }

  return {
    totalCost: cost[0],
    bestPath: path.map((i) => nodes[i].name),
    stageDetails: detailedStages,
  };
}
