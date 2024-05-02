import DatabaseManager from './DatabaseManager.js';
import ImageProcessor from './ImageProcessor.js';
import AICommunicator from './AICommunicator.js';
import AiRequestTemplates from './AiRequestTemplates.js';

const commands_example = [
    'definition',
    'description',
    { type: 'dalle', method: 'professional' },
    { type: 'dalle', method: 'creative' }
];

class AiContentGenerator {
    constructor({ dbManager = new DatabaseManager(), imageProcessor = new ImageProcessor(), limit = 20, delay = 1000 * 2, commands = [] } = {}) {
        this.aiCommunicator = new AICommunicator(process.env.OPENAI_API_KEY);
        this.dbManager = dbManager;
        this.imageProcessor = imageProcessor;
        this.aiRequestTemplates = new AiRequestTemplates(limit);
        this.delay = delay;
        this.limit = limit;
        this.commands = commands;
    }

    async setLimit(limit) {
        this.limit = limit;
    }

    async run(subject, word, commands = this.commands) {
        if (!subject || !word) {
            throw new Error("Subject or word not provided.");
        }

        const results = {};
        for (const command of commands) {
            try {
                if (typeof command === 'object' && command.type === 'dalle') {
                    results[command.method] = await this.generateImages(subject, [word], command.method);
                } else {
                    results[command] = await this.executeCommand(command, subject, word);
                }
                await this.delayExecution(this.delay);
            } catch (error) {
                console.error(`Error processing command ${command}:`, error);
            }
        }
        return results;
    }

    async executeCommand(command, subject, word) {
        const template = this.aiRequestTemplates[command];
        if (!template) {
            throw new Error(`No template found for command: ${command}`);
        }

        const result = await this.aiCommunicator.queryAI(subject, word, template);
        return Array.isArray(result) ? Promise.all(result.map(nestedSubject => this.run(nestedSubject, word))) : result;
    }

    async generateImages(subject, words, dalleMethod) {
        const imagesResults = [];
        const fn = this.aiRequestTemplates.dalle[dalleMethod];
        if (!fn) {
            throw new Error(`DALLE method not found: ${dalleMethod}`);
        }
        for (const word of words) {
            const prompt = fn(subject, word);
            const imageName = await this.imageProcessor.generateImageAndSaveFile(subject, word, prompt);
            await this.dbManager.saveDocument('images.db', { prompt, imageName });
            await this.dbManager.saveDocument('wordmaps.db', { subject, word, imageName });
            imagesResults.push(imageName);
            await this.delayExecution(this.delay);
        }
        return imagesResults;
    }

    async delayExecution(ms) {
        console.log(`delay ${ms/1000}s`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default AiContentGenerator;