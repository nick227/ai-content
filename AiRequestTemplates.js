class AiRequestTemplates {
    constructor(limit = 20) {
        this.aiRequestListLimit = limit;
    }

    setLimit(limit) {
        if (typeof limit === 'number' && limit > 0) {
            this.aiRequestListLimit = limit;
        }
    }

    get dalle() {
        return {
            getProfessional: (subject, word) => `Professional photo of ${subject} "${word}". High-resolution, studio quality, good lighting.`,
            getCreative: (subject, word) => `Creative conceptual ${subject} ${word} photograph, artistic composition, unique angle`,
            getIcon: (subject, word) => `${subject} ${word} icon, minimal design, nocrop, solid background`,
            getAbstract: (subject, word) => `Abstract ${subject} creative ${word} representation, artistic, unique depiction`,
            getCloseUp: (subject, word) => `Close-up, detailed ${subject} ${word}, high-focus, high-resolution 8k, bokeh, centered middle`,
            getCandid: (subject, word) => `Wide-angle candid photo of real ${subject} ${word}`,
            getWebDesign: (subject, word) => `Design a professional ui/ux web design for ${subject} ${word}`
        };
    }

    get form_fields() {
        return {
            message: (subject, word) => `Generate an array of online form fields for ${subject} ${word}.`,
            functionName: "get_form_fields",
            properties: (subject, word) => ({
                "get_form_fields": {
                    "type": "array",
                    "description": `Array of online form fields for: ${subject} ${word}`,
                    "items": {
                        "type": "string",
                        "description": `fields for: "${subject} ${word}" form.`
                    }
                }
            }),
            key: 'description'
        };
    }

    get businesses_ideas() {
        return {
            message: (subject, word) => `Generate an array of ${this.aiRequestListLimit} businesses for ${subject} ${word}.`,
            functionName: "get_businesses_ideas",
            properties: (subject, word) => ({
                "get_businesses": {
                    "type": "array",
                    "description": `Array of businesses related to: ${subject} ${word}`,
                    "items": {
                        "type": "string",
                        "description": `business related to: ${subject}.`
                    }
                }
            }),
            key: 'description'
        };
    }

    get description() {
        return {
            message: (subject, word) => `In the context of ${subject}. Generate a brief detailed descriptions of: ${word}.`,
            functionName: "get_description",
            properties: (subject, word) => ({
                "description": {
                    "type": "string",
                    "description": `In the context of ${subject}. Brief informative description of: ${word}`
                }
            }),
            key: 'description'
        };
    }

    get definition() {
        return {
            message: (subject, word) => `What is the definition of ${subject} ${word}.`,
            functionName: "get_definition",
            properties: (subject, word) => ({
                "definition": {
                    "type": "string",
                    "description": `In the context of ${subject}. Brief informative definition of: ${word}`
                }
            }),
            key: 'definition'
        };
    }

    get image_prompt() {
        return {
            message: (subject, word) => `Write a quality ai image generator prompt for: ${subject} ${word}.`,
            functionName: "get_image_prompt",
            properties: (subject, word) => ({
                "definition": {
                    "type": "string",
                    "description": `In the context of ${subject}. Write a quality ai image generator prompt for: ${word}`
                }
            }),
            key: 'definition'
        };
    }

    get related_words() {
        return {
            message: (subject) => `Create array of ${this.aiRequestListLimit} unique words related to "${subject}". `,
            functionName: "get_related_words",
            properties: (subject) => ({
                "related_words": {
                    "type": "array",
                    "description": `Array of words related to: ${subject}`,
                    "items": {
                        "type": "string",
                        "description": `word related to: ${subject}.`
                    }
                }
            }),
            key: 'related_words'
        };
    }

    get examples() {
        return {
            message: (subject, word) => `In the context of ${subject}. Generate array of ${this.aiRequestListLimit} well-known examples of a: ${word}.`,
            functionName: "get_examples",
            properties: (subject, word) => ({
                "examples": {
                    "type": "array",
                    "description": `In the context of ${subject}. ${this.aiRequestListLimit} popular examples of a: ${word}`,
                    "items": {
                        "type": "string",
                        "description": `example of: ${subject} ${word}.`
                    }
                }
            }),
            key: 'examples'
        };
    }

    get synonyms() {
        return {
            message: (word) => `Create array of ${this.aiRequestListLimit} synonyms for: ${word}.`,
            functionName: "get_synonyms",
            properties: (word) => ({
                "synonyms": {
                    "type": "array",
                    "description": `Array of synonyms for: ${word}`,
                    "items": {
                        "type": "string",
                        "description": `synonym for: ${word}.`
                    }
                }
            }),
            key: 'synonyms'
        };
    }
}

export default AiRequestTemplates;
