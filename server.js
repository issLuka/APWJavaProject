const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
const mongoURI = "mongodb://localhost:27017"; // Replace with your MongoDB connection string

// MongoDB client
const mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/game_scores', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define MongoDB schema and model for the game scores
const scoreSchema = new mongoose.Schema({
    playerName: String,
    gameName: String,
    score: Number
});

const Score = mongoose.model('Score', scoreSchema);

// Middleware
app.use(bodyParser.json());

// Route to fetch random Pokemon
app.get('/random-pokemon', async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('pokeDB'); // Change to 'pokeDB'
        const collection = db.collection('pokemon'); // Change to 'pokemon'

        // Count the number of documents in the collection
        const count = await collection.countDocuments();

        // Generate a random index within the range of available documents
        const randomIndex = Math.floor(Math.random() * count);

        // Find a document at the random index
        const randomPokemon = await collection.findOne({}, { skip: randomIndex });

        if (randomPokemon) {
            res.json(randomPokemon);
        } else {
            console.error('No Pokemon found');
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error fetching random Pokemon:', error);
        res.sendStatus(500);
    } finally {
        await mongoClient.close();
    }
});

// Route to submit scores for games
app.post('/submit-score', async (req, res) => {
    const { username, score } = req.body;

    try {
        await mongoClient.connect();
        const db = mongoClient.db('leaderBoardDB'); // Change to 'leaderBoardDB'
        const leaderboardCollection = db.collection('leaderboard'); // Change to 'leaderboard'

        const leaderboardEntry = {
            username: username,
            score: score
        };

        const result = await leaderboardCollection.insertOne(leaderboardEntry);
        console.log(`Leaderboard entry added with ID: ${result.insertedId}`);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error adding leaderboard entry:', error);
        res.sendStatus(500);
    } finally {
        await mongoClient.close();
    }
});

// Route to save scores for games
app.post('/saveScore', async (req, res) => {
    const { playerName, gameName, score } = req.body;

    try {
        const newScore = new Score({ playerName, gameName, score });
        await newScore.save();
        res.status(200).send('Score saved successfully!');
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).send('Failed to save score. Please try again later.');
    }
});

// Serve static files
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});