import express from 'express';
import dotenv from 'dotenv';
import DB from './DB.js';

const app = express();
const port = 3001;

dotenv.config();

app.get('/', async (req, res) => {
    const db = new DB("wordmaps.db");
    const results = await db.find({});
    res.json(results);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});