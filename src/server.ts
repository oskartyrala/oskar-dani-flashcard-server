import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";
import queryAndLog from "./support/queryAndLog";

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

app.get("/flashcards", async (_req, res) => {
    try {
        const text = "SELECT * FROM flashcard";
        qNum++;
        const response = await queryAndLog(qNum, client, text);
        const allFlashcards = response.rows;
        res.status(200).json(allFlashcards);
    } catch (err) {
        console.error(err);
    }
});

app.get("/decks", async (_req, res) => {
    try {
        const text = "SELECT * FROM deck";
        qNum++;
        const response = await queryAndLog(qNum, client, text);
        const allDecks = response.rows;
        res.status(200).json(allDecks);
    } catch (err) {
        console.error(err);
    }
});

app.post("/flashcards", async (req, res) => {
    try {
        const { front, back } = req.body;
        const text = "INSERT INTO flashcard(front, back) VALUES($1, $2)";
        const values = [front, back];
        qNum++;
        const response = await queryAndLog(qNum, client, text, values);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
    }
});

app.post("/decks", async (req, res) => {
    try {
        const { name } = req.body;
        const text = "INSERT INTO deck(name) VALUES($1)";
        const values = [name];
        qNum++;
        const response = await queryAndLog(qNum, client, text, values);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
    }
});
