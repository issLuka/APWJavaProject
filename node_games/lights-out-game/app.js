// Import necessary modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/leaderboards', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define MongoDB schema and model for scores
const scoreSchema = new mongoose.Schema({
    name: String,
    moves: Number
});

const Score = mongoose.model('Score', scoreSchema);

// Express middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game2.html'));
});

// Save score route
app.post('/saveScore', (req, res) => {
    const playerName = req.body.name.trim();
    const playerMoves = req.body.moves;
    
    // Create a new score document
    const newScore = new Score({
        name: playerName,
        moves: playerMoves
    });

    // Save the score to the database
    newScore.save()
        .then(() => {
            console.log('Score saved successfully');
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error('Error saving score:', err);
            res.status(500).send('Error saving score');
        });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});