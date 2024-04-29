import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import DB from './DB.js';

dotenv.config();

async function generateDalleImage(prompt, userId = '') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    try {
        const response = await openai.images.generate({
            prompt, n: 1, size: "1024x1024", response_format: "b64_json", model: "dall-e-3", user: userId
        });
        if (!response.data || !response.data[0] || !response.data[0].b64_json) {
            console.error('Invalid response', response);
            return { error: 'Invalid response', details: response };
        }
        const db = new DB('dalle_requests.db');
        db.insert({ prompt, userId });
        return response.data[0].b64_json;
    } catch (error) {
        console.error('Error generating image:', error);
        if (error.status === 400 && error.code === 'content_policy_violation') {
            console.error('Your request was rejected due to a content policy violation. The prompt may contain text that is not allowed by the safety system.');
        }
        return { error: 'Unknown Error generating image', details: error };
    }
}

export default generateDalleImage;