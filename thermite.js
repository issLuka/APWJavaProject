let playerMoves = 0;
let tiles = []; // Array to store the tile elements
let tileSize = 4; // Size of the grid (4x4)
let tileValues = []; // Array to store the values of the tiles

// Function to initialize the game grid
function initializeGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear the grid

    // Create tiles and add them to the grid using a for loop
    for (let i = 0; i < tileSize * tileSize; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.addEventListener('click', () => revealTile(tile));
        grid.appendChild(tile);
        tiles.push(tile);
    }

    // Shuffle and set tile values
    tileValues = Array.from({ length: tileSize * tileSize }, (_, index) => index + 1);
    shuffle(tileValues);
}

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to reveal the tiles for memorization
function revealTiles() {
    for (let index = 0; index < tiles.length; index++) {
        const tile = tiles[index];
        setTimeout(() => {
            tile.textContent = tileValues[index];
        }, 100 * index);
    }

    setTimeout(() => {
        for (let index = 0; index < tiles.length; index++) {
            const tile = tiles[index];
            tile.textContent = '';
        }
    }, 100 * tiles.length);
}

// Function to reveal a specific tile
function revealTile(tile) {
    const index = tiles.indexOf(tile);
    if (index !== -1) {
        tile.textContent = tileValues[index];
        setTimeout(() => {
            tile.textContent = '';
        }, 10000); // Hide the tile after 10 seconds
    }
}

// Start the game by initializing the grid and revealing tiles for memorization
initializeGrid();
revealTiles();
