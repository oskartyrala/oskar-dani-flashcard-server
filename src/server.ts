import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";
import queryAndLog from "./support/queryAndLog";
import getInterval from "./support/getInterval";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

let qNum = 0;

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/", async (_req, res) => {
    res.json({ msg: "Hello! There's nothing interesting for GET /" });
});

app.get("/health-check", async (_req, res) => {
    try {
        //For this to be successful, must connect to db
        await client.query("select now()");
        res.status(200).send("system ok");
    } catch (error) {
        //Recover from error rather than letting system halt
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
    console.log("Attempting to connect to db");
    await client.connect();
    console.log("Connected to db!");

    const port = getEnvVarOrFail("PORT");
    app.listen(port, () => {
        console.log(
            `Server started listening for HTTP requests on port ${port}.  Let's go!`
        );
    });
}

app.get("/:deckid/flashcards", async (req, res) => {
    try {
        const { deckid } = req.params;
        const text = "SELECT * FROM flashcard WHERE deck_id = $1";
        const values = [deckid];
        qNum++;
        const response = await queryAndLog(qNum, client, text, values);
        const deckCards = response.rows;
        res.status(200).json(deckCards);
    } catch (err) {
        console.error(err);
    }
});

app.get("/decks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const text = "SELECT * FROM deck WHERE user_id = $1";
        const values = [id];
        qNum++;
        const response = await queryAndLog(qNum, client, text, values);
        const userDecks = response.rows;
        res.status(200).json(userDecks);
    } catch (err) {
        console.error(err);
    }
});

app.post("/flashcards", async (req, res) => {
    try {
        const { front, back, deck_id } = req.body;
        const text =
            "INSERT INTO flashcard(front, back, deck_id) VALUES($1, $2, $3)";
        const values = [front, back, deck_id];
        qNum++;
        const response = await queryAndLog(qNum, client, text, values);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
    }
});

app.post("/decks", async (req, res) => {
    try {
        const { name, user_id } = req.body;
        const text = "INSERT INTO deck(name, user_id) VALUES($1, $2)";
        const values = [name, user_id];
        qNum++;
        const response = await queryAndLog(qNum, client, text, values);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
    }
});

app.post("/users", async (req, res) => {
    try {
        const { user_name } = req.body;
        const text = "INSERT INTO users(name) VALUES($1)";
        const values = [user_name];
        qNum++;
        const response = await queryAndLog(qNum, client, text, values);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
    }
});

app.get("/users", async (_req, res) => {
    try {
        const text = "SELECT * FROM users";
        qNum++;
        const response = await queryAndLog(qNum, client, text);
        const allUsers = response.rows;
        res.status(200).json(allUsers);
    } catch (err) {
        console.error(err);
    }
});

app.patch("/flashcards/:id", async (req, res) => {
    try {
        const { streak } = req.body;
        const { id } = req.params;
        const interval = getInterval(streak);
        const hours = `${interval * 24} hours`;
        const text =
            "UPDATE flashcard SET next_review = now() + $1, streak = $2 WHERE card_id = $3";
        const values = [hours, streak, id];
        const response = await queryAndLog(qNum, client, text, values);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
    }
});

app.delete("/flashcards/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const text = "DELETE from flashcard WHERE card_id = $1";
        const values = [id];
        const response = await queryAndLog(qNum, client, text, values);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
    }
});

app.delete("/decks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cardsText = "DELETE from flashcard WHERE deck_id = $1";
        const values = [id];
        const decksText = "DELETE from deck WHERE deck_id = $1";
        await queryAndLog(qNum, client, cardsText, values);
        const deckResponse = await queryAndLog(qNum, client, decksText, values);
        res.status(200).json(deckResponse);
    } catch (err) {
        console.error(err);
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cardsText =
            "DELETE from flashcard WHERE deck_id IN (SELECT deck_id FROM deck WHERE user_id = $1)";
        const decksText = "DELETE from deck WHERE user_id = $1";
        const userText = "DELETE from users WHERE id = $1";
        const values = [id];
        await queryAndLog(qNum, client, cardsText, values);
        await queryAndLog(qNum, client, decksText, values);
        const userResponse = await queryAndLog(qNum, client, userText, values);
        res.status(200).json(userResponse);
    } catch (err) {
        console.error(err);
    }
});
