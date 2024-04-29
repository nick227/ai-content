import dotenv from 'dotenv';
import AICommunicator from './AICommunicator.js';
import DatabaseManager from './DatabaseManager.js';
import ImageProcessor from './ImageProcessor.js';
import AiRequestTemplates from './AiRequestTemplates.js';
import consoleConfirmation from './consoleConfirmation.js';

class AiContentGenerator {
    constructor(params = {}) {
        dotenv.config();
        this.aiCommunicator = new AICommunicator(process.env.OPENAI_API_KEY);
        this.dbManager = new DatabaseManager();
        this.imageProcessor = new ImageProcessor();
        this.aiRequestTemplates = new AiRequestTemplates(params.limit || 40);
        this.consoleConfirmation = consoleConfirmation;
        this.delay = params.delay || 1000 * 20;  // Delay in milliseconds
        this.commands = params.commands || [];
    }

    async run(subject, word) {
        if (!subject || !word) {
            throw new Error("Subject or word not provided.");
        }

        let results = {};
        for (let command of this.commands) {
            try {
                results[command] = await this.executeCommand(command, subject, word);
                await this.delayExecution(this.delay);
            } catch (error) {
                console.error(`Error processing command ${command}:`, error);
            }
        }
        return results;
    }

    async executeCommand(command, subject, word) {
        try {
            const template = this.aiRequestTemplates[command];
            if (!template) {
                console.error(`No template found for command: ${command}`);
                return;
            }

            if (command === 'images') {
                return await this.generateImages(subject, [word]);
            }

            return await this.aiCommunicator.queryAI(subject, word, template);
        } catch (error) {
            console.error(`Error executing command ${command}:`, error);
            throw error;
        }
    }

    async delayExecution(time) {
        console.log(`Delaying for ${time / 1000}s`);
        return new Promise(resolve => setTimeout(resolve, time));
    }

    async generateImages(subject, words) {
        let imagesResults = [];
        for (const word of words) {
            for (const fn of Object.values(this.aiRequestTemplates.dalle)) {
                const prompt = fn(subject, word);
                const imageName = await this.imageProcessor.generateImageAndSaveFile(subject, word, prompt);
                await this.dbManager.saveDocument('images.db', { prompt, imageName });
                await this.dbManager.saveDocument('wordmaps.db', { subject, word, imageName });
                imagesResults.push(imageName);
                await this.delayExecution(this.delay);
            }
        }
        return imagesResults;
    }
}

export default AiContentGenerator;
