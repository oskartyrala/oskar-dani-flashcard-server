import queryAndLog from "./support/queryAndLog";
import express from "express";
import getInterval from "./support/getInterval";
import { Client } from "pg";

function flashcardRoutes(client: Client, qNum: number) {
    console.log("Flaschard router called");
    const router = express.Router();
    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const text = "SELECT * FROM flashcard WHERE card_id = $1";
            const values = [id];
            qNum++;
            const response = await queryAndLog(qNum, client, text, values);
            res.status(200).json(response.rows);
        } catch (err) {
            console.error(err);
        }
    });

    router.put("/:id", async (req, res) => {
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

    router.post("/", async (req, res) => {
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

    router.delete("/:id", async (req, res) => {
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

    return router;
}

export default flashcardRoutes;
