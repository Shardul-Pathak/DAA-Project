export default function solveTSPGraph(matrix, nodes) {
  const n = matrix.length;
  const visited = Array(n).fill(false);
  let bestPath = [];
  let bestCost = Infinity;

  function dfs(path, cost) {
    if (path.length === n) {
      const total = cost + matrix[path[path.length - 1]][path[0]];
      if (total < bestCost) {
        bestCost = total;
        bestPath = [...path, path[0]];
      }
      return;
    }

    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        visited[i] = true;
        dfs([...path, i], cost + (path.length ? matrix[path[path.length - 1]][i] : 0));
        visited[i] = false;
      }
    }
  }

  visited[0] = true;
  dfs([0], 0);

  const pathNames = bestPath.map((i) => nodes[i].name);
  const legDetails = [];
  for (let i = 0; i < bestPath.length - 1; i++) {
    legDetails.push({
      from: nodes[bestPath[i]].name,
      to: nodes[bestPath[i + 1]].name,
      cost: matrix[bestPath[i]][bestPath[i + 1]],
    });
  }

  return {
    totalCost: bestCost,
    bestPath: pathNames,
    legDetails,
  };
}
