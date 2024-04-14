let playerMoves = 0;

// Function to toggle the state of the clicked cell and its neighbors
function toggleCell(x, y) {
    const cell = document.getElementById(`${x}-${y}`);
    cell.classList.toggle('on');
    toggleAdjacent(x, y - 1);
    toggleAdjacent(x, y + 1);
    toggleAdjacent(x - 1, y);
    toggleAdjacent(x + 1, y);
    playerMoves++; // Increment moves counter
    document.getElementById('moves').textContent = playerMoves; // Update moves display
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
    for (const cell of cells) {
        if (!cell.classList.contains('on')) {
            return false; // At least one cell is not colored, game not won yet
        }
    }
    // All cells are colored, game won
    const playerName = prompt('Congratulations! You won! Enter your name to save your score:');
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
                alert('Score saved successfully!');
            } else {
                alert('Failed to save score. Please try again later.');
            }
        }).catch(error => {
            console.error('Error saving score:', error);
            alert('Failed to save score. Please try again later.');
        });
    }
}

// Function to randomly fill parts of the grid
function randomFillGrid() {
    const grid = document.getElementById('grid');
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${i}-${j}`;
            if (Math.random() < 0.5) { // Randomly toggle the cell's state
                cell.classList.add('on');
            }
            grid.appendChild(cell);
        }
    }
}

// Initialize the grid with random filling
randomFillGrid();

// Initialize the click event listener for the grid
document.getElementById('grid').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('cell')) {
        const [x, y] = target.id.split('-').map(Number);
        toggleCell(x, y);
    }
});
