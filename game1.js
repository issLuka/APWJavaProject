let score = 0;
let currentPokemon = {};

async function getRandomPokemon() {
    try {
        const response = await fetch('/random-pokemon');
        const pokemonData = await response.json();
        if (pokemonData) {
            currentPokemon = pokemonData;
            displayPokemon(currentPokemon);
        } else {
            console.error('No Pokemon found');
        }
    } catch (error) {
        console.error('Error fetching random Pokemon:', error);
    }
}

function displayPokemon(pokemon) {
    document.getElementById("pokemonImage").innerHTML = `<img src="${pokemon.imagePath}" alt="${pokemon.name}">`;
}

function checkGuess() {
    const userInput = document.getElementById("guessInput").value.trim().toLowerCase();
    if (userInput === currentPokemon.name.toLowerCase()) {
        score++;
        document.getElementById("result").textContent = "Correct!";
        document.getElementById("score").textContent = `Score: ${score}`;
        if (score === 151) {
            endGame();
        } else {
            getRandomPokemon();
        }
    } else {
        endGame();
    }
}

async function endGame() {
    alert("You failed to catch them all!");
    const userName = prompt("Enter your name:");
    
    try {
        const response = await fetch('/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: userName, score: score })
        });
        if (response.ok) {
            console.log('Score submitted successfully!');
        } else {
            console.error('Failed to submit score');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    document.getElementById("restartBtn").style.display = "block";
}

function restartGame() {
    score = 0;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("result").textContent = "";
    document.getElementById("restartBtn").style.display = "none";
    getRandomPokemon();
}

// Initialize game
getRandomPokemon();
