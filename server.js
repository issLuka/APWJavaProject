const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const uri = "mongodb://localhost:27017"; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/random-pokemon', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('pokemonDB'); // Replace 'pokemonDB' with your database name
        const collection = db.collection('pokemon'); // Replace 'pokemon' with your collection name

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
        await client.close();
    }
});

app.post('/submit-score', async (req, res) => {
    const { username, score } = req.body;

    try {
        await client.connect();
        const db = client.db('pokemonDB'); // Replace 'pokemonDB' with your database name
        const leaderboardCollection = db.collection('leaderboard'); // Replace 'leaderboard' with your collection name

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
        await client.close();
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
