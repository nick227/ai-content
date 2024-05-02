import express from 'express';
import dotenv from 'dotenv';
import DB from './includes/DB.js';
import AiRequestTemplates from './includes/AiRequestTemplates.js';
import AiContentGenerator from "./includes/AiContentGenerator.js";


const app = express();
const port = 3001;

dotenv.config();

app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/api/chat/keys', async (req, res) => {
    const aiRequestTemplates = new AiRequestTemplates();
    const results = aiRequestTemplates.keys;
    res.json(results);
});

app.get('/api/dalle/keys', async (req, res) => {
    const aiRequestTemplates = new AiRequestTemplates();
    const results = aiRequestTemplates.dalle_keys;
    res.json(results);
});

app.get('/api/wordmaps', async (req, res) => {
    const db = new DB('wordmaps.db');
    const results = await db.find({});
    res.json(results);
});

app.post('/api/generate/wordmaps', async (req, res) => {
    const { subject, word, commands, limit = 5 } = req.body;
    try {
        const app = new AiContentGenerator({limit});
        const results = await app.run(subject, word, commands);
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Failed to generate word maps:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
