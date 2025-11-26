const startButton = document.querySelector('.start_button');
const gameContainer = document.querySelector('.game_container');
const mapContainer = document.querySelector('.map');
const storyLineContainer = document.querySelector('.storyline');
const directionsButtons = document.querySelectorAll('.directionBtn');
const nameInput = document.querySelector('#playerNameInp');
const messsageContainer = document.querySelector('.message_container');
const statusContainer = document.querySelector('.status_container');
const replayButton = document.querySelector('.replay_button');
const lifeCountContainer = document.querySelector('.counter_container');

let rooms;
let exitRow, exitCol;
let keyRow, keyCol;
let freezeCrystalRow, freezeCrystalCol;
let playerRow, playerCol;
let ghostRow, ghostCol;

let playerName;
let hasKey;
let skipGhostTurn;
let lifeCount;

const validMovements = ["N", "E", "W", "S"];
const mapIcons = {
  "#": "🧱",
  ".": "R",
  "P": "☺️",
  "G": "👻",
  "K": "🔑",
  "C": "💎",
  "E": "🚪"
};

const directionsMap = {
  north: 'N',
  east: 'E',
  west: 'W',
  south: 'S'
};


const gameStates = () => {

  // MAP array showing the layout of the rooms
  // ------*LEGENDS*:------
  // . : empty rooms
  // # : a wall
  // P : represents player and their position
  // G : represents the ghost and its position
  // E : exit 
  // K : key
  // C : freezing crystal 

  rooms = [
    ["#", "P", ".", "#", "."],
    [".", ".", ".", ".", "."],
    [".", ".", "K", "C", "E"],
    [".", "#", ".", ".", "."],
    ["G", ".", "#", ".", "#"]
  ];

  // TRACK the positions
  exitRow = 2, exitCol = 4;
  keyRow = 2, keyCol = 2;
  freezeCrystalRow = 2, freezeCrystalCol = 3;
  playerRow = 0, playerCol = 1;
  ghostRow = 4, ghostCol = 0;

  // STATUS
  hasKey = false;
  skipGhostTurn = false; // NOTE: the freezing crystal will make the ghost lose a turn.

  lifeCount = 10; // reset lifecount
  displayLifeCount();

}

//STORY messages function
const showMessage = (text => {
  messsageContainer.textContent = text;
});

//STATUS message function
const updateStatus = (playerName => {
  statusContainer.textContent = `${playerName} has ${hasKey ? "✅ gotten" : "❌ not yet found"} the key 🔑.`;
});

const showMap = (playerName => {

  let row = "";
  for (let i = 0; i <= rooms.length - 1; i++) {
    for (let j = 0; j < rooms[i].length; j++) {
      row += mapIcons[rooms[i][j]] + " ";
    }
    row += "<br>";
  }
  mapContainer.innerHTML = row;
  updateStatus(playerName);
});

const checkPlayerConditions = (playerName => {

  if (playerRow === exitRow && playerCol === exitCol) {
    // CHECK if player has the key
    if (hasKey) {
      showMessage(`${playerName}, you found the exit! The gate creaks open . You get to live for now`);
      return true; // player wins!
    } else {
      showMessage(`${playerName}, the gate is locked. You need the key 🔑 first!`);
    }
  }

  if (playerRow === ghostRow && playerCol === ghostCol) {
    showMessage(`${playerName}, the creature's shadow looms over you 👻. This is the end 💀 `);
    return true;
  }
  return false;
});

const isMoveValid = (row, col) => {
  return (row >= 0 && row < rooms.length &&
    col >= 0 && col < rooms.length
    && rooms[row][col] !== "#");
}

const movePlayer = (playerMove, playerName) => {
  let newPlayerRow = playerRow;
  let newPlayerCol = playerCol;

  if (playerMove === "N") newPlayerRow--;
  if (playerMove === "S") newPlayerRow++;
  if (playerMove === "W") newPlayerCol--;
  if (playerMove === "E") newPlayerCol++;

  // CHECK if player move is valid
  if (!isMoveValid(newPlayerRow, newPlayerCol)) {
    showMessage(`${playerName}, invalid move , you stumble against a wall.`);
    return false; // dont update player position
  }

  // CLEAR the old player tile
  rooms[playerRow][playerCol] = ".";
  // UPDATE player position
  playerRow = newPlayerRow;
  playerCol = newPlayerCol;

  // PLAYER picked up key
  if (playerRow === keyRow && playerCol === keyCol && !hasKey) {
    hasKey = true;
    showMessage(`${playerName}, you found the key! 🔑`);
  }

  // PLAYER picked up crystal
  if (playerRow === freezeCrystalRow && playerCol === freezeCrystalCol) {
    skipGhostTurn = true;
    showMessage(`${playerName}, you found a gem: The freezing crystal. Ghost will lose a turn. Use this chance wisely.`);
    rooms[freezeCrystalRow][freezeCrystalCol] = "." // remove the crystal from the map
  }

  // UPDATE player symbol in the map
  rooms[playerRow][playerCol] = "P";
  return true;
};

const moveGhost = () => {
  if (skipGhostTurn) {
    showMessage('The ghost is frozen and cannot move in this turn. 👻🥶');
    skipGhostTurn = false; // reset after skipping a turn 
    return;
  }
  rooms[ghostRow][ghostCol] = ".";
  let newGhostRow = ghostRow;
  let newGhostCol = ghostCol;

  // MECHANICS :
  // if ghost is not in the same row as player, it moves vertically.
  // if ghost is on the same row, it moves horizontally.
  if (ghostRow < playerRow) newGhostRow++;
  else if (ghostRow > playerRow) newGhostRow--;
  else if (ghostCol < playerCol) newGhostCol++;
  else if (ghostCol > playerCol) newGhostCol--;

  // CHECK if ghost move is valid , avoid exit, wall
  if (isMoveValid(newGhostRow, newGhostCol) &&
    rooms[newGhostRow][newGhostCol] !== "E") {
    ghostRow = newGhostRow;
    ghostCol = newGhostCol;
  }
  rooms[ghostRow][ghostCol] = "G"; // update ghost position
}

// ------------------------------------GAME STARTS here------------------------------


const startGame = (playerName => {
  gameStates();
  showMessage('You awaken in a cold, dark labyrinth.Somewhere lies a key that unlocks your freedom. But beware.. a ghost hunts in the dark.'); //INTRO message
  showMap(playerName)

});

//LIFECOUNT
const displayLifeCount = () => {
  lifeCountContainer.textContent = `You have ${lifeCount} moves remaining`;
}

const handleMovements = (direction) => {

  if (!validMovements.includes(direction)) return;

  movePlayer(direction, playerName)
  moveGhost();

  lifeCount--;
  displayLifeCount();

  if (lifeCount <= 0) {
    showMessage(`${playerName} you ran out of life counts. Game over 👻`)
    disableDirectionButtons();
    return;
  }

  if (!hasKey) rooms[keyRow][keyCol] = "K";
  rooms[exitRow][exitCol] = "E";

  showMap(playerName);

  if (checkPlayerConditions(playerName)) {
    disableDirectionButtons();
    return;
  }
}

//DIRECTIONS
directionsButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('hide')
    const dirClass = Object.keys(directionsMap).find(dir => btn.classList.contains(dir));
    const chosenDir = directionsMap[dirClass]

    //CALL handleMovements
    handleMovements(chosenDir)
  })
})

//DISABLE buttons when player wins or dies
const disableDirectionButtons = () => {
  directionsButtons.forEach(btn => {
    btn.classList.add('hide');
    replayButton.classList.remove('hide');
  })
}

//START button
startButton.addEventListener('click', () => {
  storyLineContainer.classList.add('hide');
  gameContainer.classList.add('show');
  playerName = nameInput.value;

  startGame(playerName);
});

//REPLAY button
replayButton.addEventListener('click', () => {
  gameStates();

  replayButton.classList.add('hide');
  directionsButtons.forEach(btn => btn.classList.remove('hide'));

  startGame(playerName);
})


