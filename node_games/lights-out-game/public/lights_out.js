let playerMoves = 0;
let moveHistory = [];

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
        document.getElementById('moves').textContent = playerMoves;
    }
    checkWin();
}

function toggleAdjacent(x, y) {
    const cell = document.getElementById(`${x}-${y}`);
    if (cell) {
        cell.classList.toggle('on');
    }
}

function checkWin() {
    const cells = document.getElementsByClassName('cell');
    let allCellsOn = true;
    for (const cell of cells) {
        if (!cell.classList.contains('on')) {
            allCellsOn = false;
            break;
        }
    }
    if (allCellsOn) {
        document.getElementById('winMessage').style.display = 'block';
        document.getElementById('moveCount').style.display = 'block';
        document.getElementById('playerName').style.display = 'block';
        document.getElementById('saveScoreBtn').style.display = 'block';
    }
}

function generateSolvablePuzzle() {
    resetGrid();
    for (let i = 0; i < 10; i++) {
        const x = Math.floor(Math.random() * 5);
        const y = Math.floor(Math.random() * 5);
        toggleCell(x, y);
        moveHistory.push({ x, y });
    }
    playerMoves = 0;
}

function resetGrid() {
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells) {
        cell.classList.remove('on');
    }
    playerMoves = 0;
    document.getElementById('moves').textContent = playerMoves;
    document.getElementById('winMessage').style.display = 'none';
    document.getElementById('moveCount').style.display = 'none';
    document.getElementById('playerName').style.display = 'none';
    document.getElementById('saveScoreBtn').style.display = 'none';
    moveHistory = [];
}

function resetGame() {
    resetGrid();
    generateSolvablePuzzle();
}

function saveScore() {
    const playerName = document.getElementById('playerName').value.trim();
    if (playerName) {
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
    } else {
        alert('Please enter your name.');
    }
}

// Initialize the grid
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

// Event listeners
document.getElementById('grid').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('cell')) {
        const [x, y] = target.id.split('-').map(Number);
        toggleCell(x, y);
        document.getElementById('moves').textContent = playerMoves;
    }
});

document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('saveScoreBtn').addEventListener('click', saveScore);

// Export necessary functions
module.exports = {
    initializeGrid,
    toggleCell,
    resetGame,
    generateSolvablePuzzle,
};