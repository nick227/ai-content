import { OpenAI } from 'openai';
import DatabaseManager from './DatabaseManager.js';
import { error } from 'console';

class AICommunicator {
    constructor(apiKey, model = 'gpt-3.5-turbo-16k', maxTokens = 15890) {
        this.openai = new OpenAI(apiKey);
        this.model = model;
        this.maxTokens = maxTokens;
        this.dbManager = new DatabaseManager();
    }

    async queryAI(subject, word, aiTemplate) {
        if(word.length === 1){
            console.log('Error word is too short ')
            throw error("");
        }

        try {
            const message = aiTemplate.message(subject, word);
            const properties = aiTemplate.properties(subject, word);
            const options = this.generateOptionsObject(message, properties, aiTemplate);
            
            console.log("\n");
            console.log('__________ Query OpenAI __________');
            console.log(`${aiTemplate.functionName}`);
            console.log('message: ', message);

            const res = await this.openai.chat.completions.create(options);
            const response = this.extractResponse(res, aiTemplate.key);
            const results = Array.isArray(response) ? [...new Set(response)] : [response];

            console.log("success");
            console.log(results);
            console.log("_____________________________");
            console.log("\n");

            const payload = {
                subject,
                word
            };
            payload[aiTemplate.key] = results;

            // Save data
            await this.dbManager.saveDocument('ai_requests.db', {options, res});
            await this.dbManager.saveDocument('wordmaps.db', payload);

            return results;

        } catch (error) {
            console.error('Error querying OpenAI:', error);
            console.log('options:', JSON.stringify(options, null, 2));
            console.log('res:', JSON.stringify(res, null, 2));
            throw error;
        }
    }

    generateOptionsObject(message, properties, aiTemplate) {
        return {
            model: this.model,
            messages: [{ "role": "user", "content": message }],
            max_tokens: this.maxTokens,
            tool_choice: { "type": "function", "function": { "name": aiTemplate.functionName } },
            tools: [{
                "type": "function",
                "function": {
                    "name": aiTemplate.functionName,
                    "description": message,
                    "parameters": {
                        "type": "object",
                        "properties": properties,
                        "required": [aiTemplate.key]
                    }
                }
            }]
        };

    }

    extractResponse(response, key) {
        if (!response || !response.choices || response.choices.length === 0) {
            return null;
        }
        const firstChoice = response.choices[0];
        if (!firstChoice.message || !firstChoice.message.tool_calls || firstChoice.message.tool_calls.length === 0) {
            return null;
        }
        const firstToolCall = firstChoice.message.tool_calls[0];
        if (firstToolCall.function && firstToolCall.function.arguments) {
            return typeof firstToolCall.function.arguments === 'object'
                ? firstToolCall.function.arguments[key]
                : JSON.parse(firstToolCall.function.arguments)[key];
        }
        return null;
    }
}

export default AICommunicator;
