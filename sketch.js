checkPreviousNodes = node => {
  if (!node) {
    return null;
  }
  let previousNodes = [];
  while (node.father) {
    previousNodes.push(node.father.data);
    node = node.father;
  }
  return previousNodes;
};

getCost = node => {
  let cost = 0;
  while (node.fatherCost) {
    cost += node.fatherCost;
    node = node.father;
  }
  return cost;
};

// Depth First Search
depthFirstSearch = (problem, fringe) => {
  console.log(fringe.data);
  if (fringe.data === problem) {
    return fringe;
  } else {
    for (var node in fringe) {
      if (
        node.substring(0, 4) === "node" &&
        !checkPreviousNodes(fringe).includes(fringe[node].data)
      ) {
        fringe[node].father = fringe;
        let result = depthFirstSearch(problem, fringe[node]);
        if (result) {
          if (result.data === problem) {
            return result;
          }
        }
      }
    }
    return null;
  }
};

// Breadth First Search
breadthFirstSearch = (problem, firstFringe) => {
  queue = [firstFringe];
  for (let index = 0; index < queue.length; index++) {
    let fringe = queue[index];
    console.log(fringe.data);
    if (fringe.data === problem) {
      return fringe;
    } else {
      for (var node in fringe) {
        if (
          node.substring(0, 4) === "node" &&
          !checkPreviousNodes(fringe).includes(fringe[node].data)
        ) {
          fringe[node].father = fringe;
          queue.push(fringe[node]);
        }
      }
    }
  }
  return null;
};

// Limited Depth Search
limitedDepthSearch = (problem, fringe, l) => {
  console.log(fringe.data);
  if (fringe.data === problem) {
    return fringe;
  } else {
    if (l - 1 >= 0) {
      for (var node in fringe) {
        if (
          node.substring(0, 4) === "node" &&
          !checkPreviousNodes(fringe).includes(fringe[node].data)
        ) {
          fringe[node].father = fringe;
          let result = limitedDepthSearch(problem, fringe[node], l - 1);
          if (result) {
            if (result.data === problem) {
              return result;
            }
          }
        }
      }
    }
    return null;
  }
};

// Iterative Deepening Search
iterativeDeepeningSearch = (problem, fringe) => {
  let l = 0;
  while (true) {
    let result = limitedDepthSearch(problem, fringe, l);
    if (result) {
      if (result.data === problem) {
        return result;
      }
    }
    l += 1;
  }
};

//UCS, Greedy and A*
bestSearch = (problem, firstFringe, type) => {
  let queue = [firstFringe];
  while (queue.length > 0) {
    let qIndex = 0;
    queue.forEach((node, nodeIndex, nodeArray) => {
      if (type === "UCS") {
        if (getCost(nodeArray[qIndex]) > getCost(node)) {
          qIndex = nodeIndex;
        }
      } else if (type === "Greedy") {
        if (
          dist(
            nodeArray[qIndex].cords.x,
            nodeArray[qIndex].cords.y,
            problem.cords.x,
            problem.cords.y
          ) > dist(node.cords.x, node.cords.y, problem.cords.x, problem.cords.y)
        ) {
          qIndex = nodeIndex;
        }
      } else if (type === "A*") {
        if (
          dist(
            nodeArray[qIndex].cords.x,
            nodeArray[qIndex].cords.y,
            problem.cords.x,
            problem.cords.y
          ) +
            getCost(nodeArray[qIndex]) >
          dist(node.cords.x, node.cords.y, problem.cords.x, problem.cords.y) +
            getCost(node)
        ) {
          qIndex = nodeIndex;
        }
      }
    });
    let q = queue.splice(qIndex, 1)[0];
    console.log(q.data);
    if (q.data == problem.data) {
      return q;
    }
    for (var node in q) {
      if (
        node.substring(0, 4) === "node" &&
        !checkPreviousNodes(q).includes(q[node].data)
      ) {
        let newNode = { ...q[node] };
        newNode.father = q;
        newNode.fatherCost = q["cost" + node.substring(4)];
        queue.push(newNode);
      }
    }
  }
  return null;
};

solveEightPuzzle = node => {
  let queue = [node];
  while (queue.length > 0) {
    let qIndex = 0;
    queue.forEach((node, nodeIndex, nodeArray) => {
      if (getEightPuzzleCost(nodeArray[qIndex]) > getEightPuzzleCost(node)) {
        qIndex = nodeIndex;
      }
    });
    let q = queue.splice(qIndex, 1)[0];
    console.log(q.data);
    if (q.data === [[1, 2, 3], [4, 5, 6], [7, 8, null]]) {
      return q;
    }
    possibleMoves = getEightPuzzleMoves(node);
    for (let index = 0; index < possibleMoves.length; index++) {
      let newNode = { data: possibleMoves[index], father: node };
      queue.push(newNode);
    }
  }
  return null;
};

getEightPuzzleMoves = node => {
  let indexOfNull = 0;
  let possibleMoves = [];
  for (let r = 0; r < node.data.length; r++) {
    for (let c = 0; c < node.data[r].length; c++) {
      if (node.data[r][c] === null) {
        indexOfNull = createVector(r, c);
      }
    }
  }
  if (indexOfNull.x != 0) {
    let newArray = [[], [], []];
    for (let r = 0; r < node.data.length; r++) {
      for (let c = 0; c < node.data[r].length; c++) {
        if (r === indexOfNull.r && c === indexOfNull.c) {
          newArray[r][c] === node.data[r - 1][c];
        } else {
          newArray[r][c] = node.data[r][c];
        }
      }
    }
    newArray[indexOfNull.x - 1][indexOfNull.y] = null;
    possibleMoves.push(newArray);
  }
  if (indexOfNull.x != 2) {
    let newArray = [[], [], []];
    for (let r = 0; r < node.data.length; r++) {
      for (let c = 0; c < node.data[r].length; c++) {
        if (r === indexOfNull.r && c === indexOfNull.c) {
          newArray[r][c] === node.data[r + 1][c];
        } else {
          newArray[r][c] = node.data[r][c];
        }
      }
    }
    newArray[indexOfNull.x + 1][indexOfNull.y] = null;
    possibleMoves.push(newArray);
  }
  if (indexOfNull.y != 0) {
    let newArray = [[], [], []];
    for (let r = 0; r < node.data.length; r++) {
      for (let c = 0; c < node.data[r].length; c++) {
        if (r === indexOfNull.r && c === indexOfNull.c) {
          newArray[r][c] === node.data[r][c - 1];
        } else {
          newArray[r][c] = node.data[r][c];
        }
      }
    }
    newArray[indexOfNull.x][indexOfNull.y - 1] = null;
    possibleMoves.push(newArray);
  }
  if (indexOfNull.y != 2) {
    let newArray = [[], [], []];
    for (let r = 0; r < node.data.length; r++) {
      for (let c = 0; c < node.data[r].length; c++) {
        if (r === indexOfNull.r && c === indexOfNull.c) {
          newArray[r][c] === node.data[r][c + 1];
        } else {
          newArray[r][c] = node.data[r][c];
        }
      }
    }
    newArray[indexOfNull.x][indexOfNull.y + 1] = null;
    possibleMoves.push(newArray);
  }
  let previousMoves = checkPreviousNodes(node);
  possibleMoves.forEach((move, moveIndex, moveArray) => {
    for (
      let previousMovesIndex = 0;
      previousMovesIndex < previousMoves.length;
      previousMovesIndex++
    ) {
      if (move === previousMoves[previousMovesIndex]) {
        moveArray.splice(moveIndex, 1);
      }
    }
  });
  return possibleMoves;
};

getEightPuzzleCost = node => {
  let cost = 0;
  nodeFather = node.father;
  while (nodeFather) {
    cost += 1;
    nodeFather = node.father;
  }
  let manhattanCostNumbers = [];
  const solution = [[1, 2, 3], [4, 5, 6], [7, 8, null]];
  for (let r = 0; r < node.data.length; r++) {
    for (let c = 0; c < node.data[r].length; c++) {
      let num = node.data[r][c];
      for (let rS = 0; rS < solution.length; rS++) {
        for (let cS = 0; cS < solution[r].length; cS++) {
          let numS = solution[r][c];
          if (num === numS) {
            manhattanCostNumbers[num] = Math.abs(r - rS) + Math.abs(c - cS);
          }
        }
      }
    }
  }
  manhattanCostNumbers.forEach(numberCost => {
    cost += numberCost;
  });
  return cost;
};

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  addingNode = false;
  linkingNodes = false;
  bfsActivated = false;
  dfsActivated = false;
  idsActivated = false;
  ucsActivated = false;
  greedyActivated = false;
  aStarActivated = false;
  inspectMode = false;
  removeMode = false;
  nodes = [];
  pastNode = null;
  solution = null;
  eightPuzzleMode = false;
  eightPuzzle = {
    data: [[1, 2, null], [4, 5, 3], [7, 8, 6]]
  };
  addingButton = createButton("Add");
  addingButton.position(10, 10);
  addingButton.mouseClicked(() => {
    resetAllModes();
    addingNode = !addingNode;
  });
  dataInput = createInput();
  dataInput.position(50, 10);
  linkingButton = createButton("Link");
  linkingButton.position(100, 10);
  linkingButton.mouseClicked(() => {
    resetAllModes();
    linkingNodes = !linkingNodes;
  });
  costInput = createInput();
  costInput.position(140, 10);
  ucsButton = createButton("UCS");
  ucsButton.position(200, 10);
  ucsButton.mouseClicked(() => {
    resetAllModes();
    ucsActivated = !ucsActivated;
  });
  greedyButton = createButton("Greedy");
  greedyButton.position(245, 10);
  greedyButton.mouseClicked(() => {
    resetAllModes();
    greedyActivated = !greedyActivated;
  });
  aStarButton = createButton("A*");
  aStarButton.position(310, 10);
  aStarButton.mouseClicked(() => {
    resetAllModes();
    aStarActivated = !aStarActivated;
  });
  inspectButton = createButton("Inspect");
  inspectButton.position(350, 10);
  inspectButton.mouseClicked(() => {
    resetAllModes();
    inspectMode = !inspectMode;
    nodes.forEach(node => {
      console.log(
        `{cords: createVector(${node.cords.x}, ${node.cords.y}), data: '${
          node.data
        }'}`
      );
    });
  });
  removeButton = createButton("Remove");
  removeButton.position(410, 10);
  removeButton.mouseClicked(() => {
    resetAllModes();
    removeMode = !removeMode;
  });
  loadAlphabetButton = createButton("Load Alphabet");
  loadAlphabetButton.position(500, 10);
  loadAlphabetButton.mouseClicked(loadAlphabet);
  loadRomaniaButton = createButton("Load Romania");
  loadRomaniaButton.position(610, 10);
  loadRomaniaButton.mouseClicked(loadRomania);
  loadEightPuzzleButton = createButton("Load 8-Puzzle");
  loadEightPuzzleButton.position(720, 10);
  loadEightPuzzleButton.mouseClicked(() => {
    eightPuzzleMode = !eightPuzzleMode;
  });
  solveEightPuzzleButton = createButton("Solve");
  solveEightPuzzleButton.position(10, 100);
  solveEightPuzzleButton.mouseClicked(() => {
    eightPuzzle = solveEightPuzzle(eightPuzzle);
  });
}

function draw() {
  background(255);
  fill(color(175, 175, 175));
  rect(0, 0, width, 50);
  stroke(0);
  textSize(32);
  fill(0);
  if (linkingNodes) {
    text("Linking Nodes", 10, 100);
  }
  if (addingNode) {
    text("Adding Node", 10, 100);
  }
  if (pastNode) {
    text("First Node Selected", 10, 200);
  }
  if (solution) {
    text(solution, 10, 100);
  } else {
    if (bfsActivated) {
      text("BFS", 10, 100);
    }
    if (dfsActivated) {
      text("DFS", 10, 100);
    }
    if (idsActivated) {
      text("IDS", 10, 100);
    }
    if (ucsActivated) {
      text("UCS", 10, 100);
    }
    if (greedyActivated) {
      text("Greedy", 10, 100);
    }
    if (aStarActivated) {
      text("A*", 10, 100);
    }
  }
  if (inspectMode) {
    text("Inspect", 10, 100);
  }
  if (removeMode) {
    text("Remove", 10, 100);
  }
  if (eightPuzzleMode) {
    solveEightPuzzleButton.show();
    push();
    fill(255);
    rect(100, 100, 100, 100);
    rect(200, 100, 100, 100);
    rect(300, 100, 100, 100);
    rect(100, 200, 100, 100);
    rect(200, 200, 100, 100);
    rect(300, 200, 100, 100);
    rect(100, 300, 100, 100);
    rect(200, 300, 100, 100);
    rect(300, 300, 100, 100);
    pop();
    for (let r = 0; r < eightPuzzle.data.length; r++) {
      for (let c = 0; c < eightPuzzle.data[r].length; c++) {
        if (eightPuzzle.data[r][c]) {
          text(eightPuzzle.data[r][c], (c + 1) * 100 + 50, (r + 1) * 100 + 50);
        }
      }
    }
  } else {
    solveEightPuzzleButton.hide();
    nodes.forEach(node => {
      fill(255, 204, 0);
      ellipse(node.cords.x, node.cords.y, 10);
      push();
      fill(0);
      textSize(15);
      text(node.data, node.cords.x, node.cords.y);
      pop();
      for (var linkingNode in node) {
        if (linkingNode.substring(0, 4) === "cost") {
          let minX = Math.min(
            node["node" + linkingNode.substring(4)].cords.x,
            node.cords.x
          );
          let maxX = Math.max(
            node["node" + linkingNode.substring(4)].cords.x,
            node.cords.x
          );
          let minY = Math.min(
            node["node" + linkingNode.substring(4)].cords.y,
            node.cords.y
          );
          let maxY = Math.max(
            node["node" + linkingNode.substring(4)].cords.y,
            node.cords.y
          );
          push();
          fill(0, 0, 255);
          textSize(15);
          text(
            node[linkingNode],
            minX + (maxX - minX) / 2,
            minY + (maxY - minY) / 2
          );
          pop();
        } else if (linkingNode.substring(0, 4) === "node") {
          line(
            node.cords.x,
            node.cords.y,
            node[linkingNode].cords.x,
            node[linkingNode].cords.y
          );
        }
      }
    });
  }
}

function mouseClicked() {
  if (mouseY > 50) {
    if (addingNode) {
      let newNode = {
        cords: createVector(mouseX, mouseY),
        data: dataInput.value()
      };
      nodes.push(newNode);
    } else if (linkingNodes && pastNode) {
      let newNodeLink = getNewNode();
      if (newNodeLink) {
        if (
          newNodeLink.cords.x != pastNode.cords.x &&
          newNodeLink.cords.x != pastNode.cords.x
        ) {
          nodeNumber = 1;
          while (pastNode["node" + nodeNumber]) {
            nodeNumber += 1;
          }
          pastNode["node" + nodeNumber] = newNodeLink;
          pastNode["cost" + nodeNumber] = parseInt(costInput.value(), 10);
          nodeNumber = 1;
          while (newNodeLink["node" + nodeNumber]) {
            nodeNumber += 1;
          }
          newNodeLink["node" + nodeNumber] = pastNode;
          newNodeLink["cost" + nodeNumber] = parseInt(costInput.value(), 10);
          pastNode = null;
        }
      }
    } else if (bfsActivated && pastNode) {
      let endingNode = getNewNode();
      if (endingNode) {
        solution = getSolution(
          checkPreviousNodes(breadthFirstSearch(endingNode.data, pastNode)),
          endingNode.data
        );
        pastNode = null;
      }
    } else if (dfsActivated && pastNode) {
      let endingNode = getNewNode();
      if (endingNode) {
        solution = getSolution(
          checkPreviousNodes(depthFirstSearch(endingNode.data, pastNode)),
          endingNode.data
        );
        pastNode = null;
      }
    } else if (idsActivated && pastNode) {
      let endingNode = getNewNode();
      if (endingNode) {
        solution = getSolution(
          checkPreviousNodes(iterativeDeepeningSearch(endingNode, pastNode)),
          endingNode.data
        );
        pastNode = null;
      }
    } else if (ucsActivated && pastNode) {
      let endingNode = getNewNode();
      if (endingNode) {
        solution = getSolution(
          checkPreviousNodes(bestSearch(endingNode, pastNode, "UCS")),
          endingNode.data
        );
        pastNode = null;
      }
    } else if (greedyActivated && pastNode) {
      let endingNode = getNewNode();
      if (endingNode) {
        solution = getSolution(
          checkPreviousNodes(bestSearch(endingNode, pastNode, "Greedy")),
          endingNode.data
        );
        pastNode = null;
      }
    } else if (aStarActivated && pastNode) {
      let endingNode = getNewNode();
      if (endingNode) {
        solution = getSolution(
          checkPreviousNodes(bestSearch(endingNode, pastNode, "A*")),
          endingNode.data
        );
        pastNode = null;
      }
    } else if (
      bfsActivated ||
      dfsActivated ||
      idsActivated ||
      linkingNodes ||
      ucsActivated ||
      greedyActivated ||
      aStarActivated
    ) {
      pastNode = getNewNode();
    } else if (inspectMode) {
      nodes.forEach(node => {
        if (dist(mouseX, mouseY, node.cords.x, node.cords.y) <= 10) {
          console.log(node);
        }
      });
    } else if (removeMode) {
      nodes.forEach((node, index, array) => {
        if (dist(mouseX, mouseY, node.cords.x, node.cords.y) <= 10) {
          array.splice(index, 1);
        }
      });
    }
  }
}

getNewNode = () => {
  let newNode = null;
  nodes.forEach(node => {
    if (dist(mouseX, mouseY, node.cords.x, node.cords.y) <= 10) {
      newNode = node;
    }
  });
  return newNode;
};

loadAlphabet = () => {
  nodes = [
    { cords: createVector(228, 125), data: "A" },
    { cords: createVector(154, 139), data: "B" },
    { cords: createVector(292, 143), data: "C" },
    { cords: createVector(86, 161), data: "D" },
    { cords: createVector(163, 164), data: "E" },
    { cords: createVector(270, 165), data: "F" },
    { cords: createVector(367, 169), data: "G" },
    { cords: createVector(24, 189), data: "H" },
    { cords: createVector(98, 189), data: "I" },
    { cords: createVector(143, 187), data: "J" },
    { cords: createVector(183, 187), data: "K" },
    { cords: createVector(248, 186), data: "L" },
    { cords: createVector(287, 187), data: "M" },
    { cords: createVector(351, 187), data: "N" },
    { cords: createVector(428, 191), data: "O" }
  ];
};

loadRomania = () => {
  nodes = [
    //0
    { cords: createVector(119, 141), data: "Oradea" },
    //1
    { cords: createVector(86, 191), data: "Zerind" },
    //2
    { cords: createVector(56, 252), data: "Arad" },
    //3
    { cords: createVector(76, 332), data: "Timisoara" },
    //4
    { cords: createVector(174, 374), data: "Lugoj" },
    //5
    { cords: createVector(186, 418), data: "Mehadia" },
    //6
    { cords: createVector(173, 453), data: "Dobreta" },
    //7
    { cords: createVector(296, 466), data: "Craiova" },
    //8
    { cords: createVector(291, 321), data: "Rimnicu Vilcea" },
    //9
    { cords: createVector(228, 258), data: "Sibiu" },
    //10
    { cords: createVector(350, 250), data: "Fagaras" },
    //11
    { cords: createVector(406, 385), data: "Pitesti" },
    //12
    { cords: createVector(533, 417), data: "Bucharest" },
    //13
    { cords: createVector(501, 487), data: "Giurgiu" },
    //14
    { cords: createVector(640, 397), data: "Urziceni" },
    //15
    { cords: createVector(755, 405), data: "Hirsova" },
    //16
    { cords: createVector(798, 473), data: "Eforie" },
    //17
    { cords: createVector(716, 257), data: "Vaslui" },
    //18
    { cords: createVector(659, 187), data: "Iasi" },
    //19
    { cords: createVector(541, 146), data: "Neamt" }
  ];
  nodes[0].node1 = nodes[1];
  nodes[0].cost1 = 71;
  nodes[1].node1 = nodes[0];
  nodes[1].cost1 = 71;
  nodes[1].node2 = nodes[2];
  nodes[1].cost2 = 75;
  nodes[2].node1 = nodes[1];
  nodes[2].cost1 = 75;
  nodes[2].node2 = nodes[3];
  nodes[2].cost2 = 118;
  nodes[2].node3 = nodes[9];
  nodes[2].cost3 = 140;
  nodes[3].node1 = nodes[2];
  nodes[3].cost1 = 118;
  nodes[3].node2 = nodes[4];
  nodes[3].cost2 = 111;
  nodes[4].node1 = nodes[3];
  nodes[4].cost1 = 111;
  nodes[4].node2 = nodes[5];
  nodes[4].cost2 = 70;
  nodes[5].node1 = nodes[4];
  nodes[5].cost1 = 70;
  nodes[5].node2 = nodes[6];
  nodes[5].cost2 = 75;
  nodes[6].node1 = nodes[5];
  nodes[6].cost1 = 75;
  nodes[6].node2 = nodes[7];
  nodes[6].cost2 = 120;
  nodes[7].node1 = nodes[6];
  nodes[7].cost1 = 120;
  nodes[7].node2 = nodes[8];
  nodes[7].cost2 = 146;
  nodes[7].node3 = nodes[11];
  nodes[7].cost3 = 138;
  nodes[8].node1 = nodes[7];
  nodes[8].cost1 = 146;
  nodes[8].node2 = nodes[9];
  nodes[8].cost2 = 80;
  nodes[8].node3 = nodes[11];
  nodes[8].cost3 = 97;
  nodes[9].node1 = nodes[8];
  nodes[9].cost1 = 80;
  nodes[9].node2 = nodes[10];
  nodes[9].cost2 = 99;
  nodes[9].node3 = nodes[2];
  nodes[9].cost3 = 140;
  nodes[10].node1 = nodes[9];
  nodes[10].cost1 = 99;
  nodes[10].node2 = nodes[12];
  nodes[10].cost2 = 211;
  nodes[11].node1 = nodes[7];
  nodes[11].cost1 = 138;
  nodes[11].node2 = nodes[8];
  nodes[11].cost2 = 97;
  nodes[11].node3 = nodes[12];
  nodes[11].cost3 = 101;
  nodes[12].node1 = nodes[11];
  nodes[12].cost1 = 101;
  nodes[12].node2 = nodes[10];
  nodes[12].cost2 = 211;
  nodes[12].node3 = nodes[13];
  nodes[12].cost3 = 90;
  nodes[12].node4 = nodes[14];
  nodes[12].cost4 = 86;
  nodes[13].node1 = nodes[12];
  nodes[13].cost1 = 90;
  nodes[14].node1 = nodes[12];
  nodes[14].cost1 = 86;
  nodes[14].node2 = nodes[15];
  nodes[14].cost2 = 98;
  nodes[15].node1 = nodes[14];
  nodes[15].cost1 = 98;
  nodes[15].node2 = nodes[16];
  nodes[15].cost2 = 86;
  nodes[15].node3 = nodes[17];
  nodes[15].cost3 = 142;
  nodes[16].node1 = nodes[15];
  nodes[16].cost1 = 86;
  nodes[17].node1 = nodes[15];
  nodes[17].cost1 = 142;
  nodes[17].node2 = nodes[18];
  nodes[17].cost2 = 92;
  nodes[18].node1 = nodes[17];
  nodes[18].cost1 = 92;
  nodes[18].node2 = nodes[19];
  nodes[18].cost2 = 87;
  nodes[19].node1 = nodes[18];
  nodes[19].cost1 = 87;
};

resetAllModes = () => {
  addingNode = false;
  linkingNodes = false;
  bfsActivated = false;
  dfsActivated = false;
  idsActivated = false;
  inspectMode = false;
  removeMode = false;
  solution = null;
  ucsActivated = false;
  greedyActivated = false;
  aStarActivated = false;
};

getSolution = (parents, goal) => {
  if (!parents) {
    return "No Path Found!";
  }
  let s = "";
  for (let index = parents.length - 1; index >= 0; index--) {
    s += parents[index] + "=>";
  }
  s += goal;
  return s;
};
