import queryAndLog from "./support/queryAndLog";
import express from "express";

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

    return router;
}

export default flashcardRoutes;
