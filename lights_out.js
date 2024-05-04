//Tyler Roeder
let playerMoves = 0;
let moveHistory = [];

// Function to toggle the state of the clicked cell and its neighbors
function toggleCell(x, y) {
    const cell = document.getElementById(`${x}-${y}`);
    if (cell.classList.contains('on')) {
        playerMoves--;
    } else {
        playerMoves++;
    }
    cell.classList.toggle('on');
    toggleAdjacent(x, y - 1);
    toggleAdjacent(x, y + 1);
    toggleAdjacent(x - 1, y);
    toggleAdjacent(x + 1, y);
    if (!document.getElementById('winMessage').style.display) {
        // Update moves count display only if the game is not won yet
        document.getElementById('moves').textContent = playerMoves;
    }
    checkWin(); // Check if the game is won after each move
}

// Function to toggle the state of an adjacent cell
function toggleAdjacent(x, y) {
    const cell = document.getElementById(`${x}-${y}`);
    if (cell) {
        cell.classList.toggle('on');
    }
}

// Function to check if all cells are turned on
function checkWin() {
    const cells = document.getElementsByClassName('cell');
    let allCellsOn = true;
    for (const cell of cells) {
        if (!cell.classList.contains('on')) {
            allCellsOn = false; // At least one cell is not colored, game not won yet
            break;
        }
    }
    if (allCellsOn) {
        // All cells are colored, game won
        document.getElementById('winMessage').style.display = 'block';
        document.getElementById('moveCount').style.display = 'block';
        document.getElementById('playerName').style.display = 'block';
        document.getElementById('saveScoreBtn').style.display = 'block';
    }
}

// Function to generate a solvable puzzle
function generateSolvablePuzzle() {
    resetGrid();
    for (let i = 0; i < 10; i++) {
        const x = Math.floor(Math.random() * 5);
        const y = Math.floor(Math.random() * 5);
        toggleCell(x, y);
        moveHistory.push({ x, y }); // Record the move
    }
    // Reset playerMoves after generating the puzzle
    playerMoves = 0;
}

// Function to reset the grid to its initial state
function resetGrid() {
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells) {
        cell.classList.remove('on');
    }
    playerMoves = 0; // Reset moves counter
    document.getElementById('moves').textContent = playerMoves; // Update moves display
    document.getElementById('winMessage').style.display = 'none'; // Hide win message
    document.getElementById('moveCount').style.display = 'none';
    document.getElementById('playerName').style.display = 'none';
    document.getElementById('saveScoreBtn').style.display = 'none';
    moveHistory = []; // Clear move history
}

// Function to reset the game to its initial state with a new solvable puzzle
function resetGame() {
    resetGrid();
    generateSolvablePuzzle();
}

// Function to initialize the grid with random filling
function initializeGrid() {
    const grid = document.getElementById('grid');
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${i}-${j}`;
            grid.appendChild(cell);
        }
    }
}

// Initialize the grid with random filling
initializeGrid();

// Initialize the click event listener for the grid
document.getElementById('grid').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('cell')) {
        const [x, y] = target.id.split('-').map(Number);
        toggleCell(x, y);
        document.getElementById('moves').textContent = playerMoves; // Update moves count display
    }
});


// Initialize the reset button click event listener
document.getElementById('resetBtn').addEventListener('click', resetGame);

// Save score button click event
document.getElementById('saveScoreBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (playerName) {
        // Send player name and moves count to the server to save the score
        const data = { name: playerName, moves: playerMoves };
        fetch('/saveScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                alert('Score saved successfully!'); // Prompt message when the score is saved
            } else {
                alert('Failed to save score. Please try again later.');
            }
        }).catch(error => {
            console.error('Error saving score:', error);
            alert('Failed to save score. Please try again later.');
        });
    } else {
        alert('Please enter your name.');
    }
});
