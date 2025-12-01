const startButton = document.querySelector('.start_button');
const gameContainer = document.querySelector('.game_container');
const mapContainer = document.querySelector('.map');
const storyLineContainer = document.querySelector('.storyline');
const directionsButtons = document.querySelectorAll('.directionBtn');
const nameInput = document.querySelector('#playerNameInp');
const messsageContainer = document.querySelector('.message_container');
const statusContainer = document.querySelector('.status_container');
const replayButton = document.querySelector('.replay_button');
const quitButton = document.querySelector('.quit_button');
const lifeCountContainer = document.querySelector('.counter_container');
const scoreContainer = document.querySelector('.score_container');


let rooms;
let exitRow, exitCol;
let keyRow, keyCol;
let freezeCrystalRow, freezeCrystalCol;
let playerRow, playerCol;
let ghostRow, ghostCol;

let playerName = " ";
let hasKey;
let skipGhostTurn;
let lifeCount;
let playerWins = 0;
let playerLoses = 0;

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

//RANDOMIZED map
const getRandomEmptyCell = (map) => {
  let row, col;

  do {
    row = Math.floor(Math.random() * map.length);
    col = Math.floor(Math.random() * map[0].length)
  }
  while (map[row][col] !== ".");
  return [row, col];
}

const generateRandomizedEntities = () => {
  //reset map
  rooms = [
    ["#", ".", ".", "#", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", "#", ".", ".", "."],
    [".", ".", ".", ".", "."]
  ];
  //random for all the entities
  [exitRow, exitCol] = getRandomEmptyCell(rooms);
  rooms[exitRow][exitCol] = "E";

  [keyRow, keyCol] = getRandomEmptyCell(rooms);
  rooms[keyRow][keyCol] = "K";

  [freezeCrystalRow, freezeCrystalCol] = getRandomEmptyCell(rooms);
  rooms[freezeCrystalRow][freezeCrystalCol] = "C";

  [playerRow, playerCol] = getRandomEmptyCell(rooms);
  rooms[playerRow][playerCol] = "P";

  [ghostRow, ghostCol] = getRandomEmptyCell(rooms);
  rooms[ghostRow][ghostCol] = "G";

}


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

  displayScore();

}

//STORY messages function
const showMessage = (text => {
  $('.message_container').fadeOut(0).text(text).fadeIn(600);
});

//STATUS message function
const updateStatus = (playerName => {
  statusContainer.textContent = `${hasKey ? "✅ " : "❌"} ${playerName}  has ${hasKey ? "gotten" : "not yet found"} the key 🔑`;
});

const showMap = (playerName => {

  mapContainer.innerHTML = "";

  rooms.forEach(row => {
    row.forEach(roomTile => {
      const roomCell = document.createElement("div");
      roomCell.classList.add("room");
      roomCell.textContent = mapIcons[roomTile];
      mapContainer.appendChild(roomCell);
    });
  });

  updateStatus(playerName)
});

const checkPlayerConditions = (playerName => {

  if (playerRow === exitRow && playerCol === exitCol) {
    // CHECK if player has the key
    if (hasKey) {
      playerWins++;
      displayScore();
      showMessage(`${playerName}, you found the exit! The gate creaks open . You get to live for now`);
      return true; // player wins!
    } else {
      showMessage(`${playerName}, the gate is locked. You need the key 🔑 first!`);
    }
  }

  if (playerRow === ghostRow && playerCol === ghostCol) {
    playerLoses++;
    displayScore();
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
  mapEffect();
  generateRandomizedEntities();
  showMessage('You awaken in a cold, dark labyrinth.Somewhere lies a key that unlocks your freedom. But beware.. a ghost hunts in the dark.'); //INTRO message
  showMap(playerName)

});

//LIFECOUNT
const displayLifeCount = () => {
  lifeCountContainer.textContent = `You have ${lifeCount} moves remaining`;
}

//TRACK player wins or losses 
const displayScore = () => {
  scoreContainer.textContent = `Wins: ${playerWins} Losses: ${playerLoses} `;
}

const handleMovements = (direction) => {

  if (!validMovements.includes(direction)) return;

  movePlayer(direction, playerName)
  moveGhost();

  lifeCount--;
  displayLifeCount();

  if (lifeCount <= 0) {
    showMessage(`${playerName} you ran out of life counts. Game over 👻`)
    playerLoses++;
    displayScore();
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
  })
  replayButton.classList.remove('hide');
  quitButton.classList.remove('hide');
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
  quitButton.classList.add('hide');
  directionsButtons.forEach(btn => btn.classList.remove('hide'));

  startGame(playerName);
})

//QUIT button 
quitButton.addEventListener('click', () => {
  replayButton.classList.add('hide');
  quitButton.classList.add('hide');
  storyLineContainer.classList.remove('hide');
  gameContainer.classList.remove('show');
  nameInput.value = " ";

  location.reload(); //refresh the page

})

$('.intro-container').delay(5000).fadeOut();
$('.intro_text').fadeIn(1000).delay(1500).fadeOut(1000);

const mapEffect = () => {
  $('.map').hide().fadeIn(600);
}

//BUTTONS effects: cross platfrom sol'n using touch events
$('.directionBtn').on({
  touchstart: e => $(e.target).addClass('press'),
  touchend: e => $(e.target).removeClass('press'),

})


