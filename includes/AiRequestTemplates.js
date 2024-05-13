class AiRequestTemplates {
    constructor(limit = 20) {
        this.aiRequestListLimit = limit;
    }

    get dalle_keys() {
        return [
            'professional',
            'creative',
            'graffiti',
            'geometric',
            'icon_minimal',
            'icon_mono',
            'icon_cartoon',
            'icon_colorful',
            'icon_8bit',
            'icon_angle',
            'abstract',
            'close_up',
            'candid',
            'web_design',
            'schematic',
            'photograph',
            'product_photography',
            'corporate_art',
            'pattern',
            'fashion',
            'bauhaus_art',
            'clip_art',
            'ink_art',
            'pop_art'
        ]
    }

    get keys() {
        return [
            'form_fields',
            'businesses_ideas',
            'description',
            'definition',
            'image_prompt',
            'related_words',
            'examples',
            'synonyms',
            'how_to',
            'types',
            'attributes',
            'ux_styles',
            'faq',
            'books',
            'websites',
            'tos',
            'variations',
            'market_trends',
            'legal_regulations',
            'employee_skills',
            'competitors',
            'ux_styles',
            'todos',
            'introductions'
        ]
    }

    get dalle() {
        return {
            fashion: (subject, word) => `Glamourous fashion photo of ${subject} "${word}". High-resolution, studio quality, style, dramatic lighting.`,
            professional: (subject, word) => `Professional photo of ${subject} "${word}". High-resolution, studio quality, good lighting.`,
            creative: (subject, word) => `Creative conceptual ${subject} ${word} photograph, artistic composition, unique angle`,
            geometric: (subject, word) => `Compose ${subject} ${word} geometric art, artistic creative, symmetrical, geometric art style`,
            graffiti: (subject, word) => `Detailed quality graffiti art style ${subject} ${word}, hip cool, graffiti style`,
            pattern: (subject, word) => `Create infinite repeating pattern of ${subject} ${word}, seamless, infinite continuous, repeating pattern`,
            icon_cartoon: (subject, word) => `Cartoon icon of ${subject} ${word},cartoon style, saturated colors, nocrop, adorable cute`,
            icon_8bit: (subject, word) => `Pixel art icon of ${subject} ${word}, using classic 8-bit graphics, nocrop, solid background`,
            icon_minimal: (subject, word) => `Minimal ${subject} ${word} icon, minimal design, nocrop, solid background`,
            icon_colorful: (subject, word) => `creative colorful ${subject} ${word} icon, nocrop, solid background`,
            icon_mono: (subject, word) => `Monotone ${subject} ${word} icon, black and white, nocrop, white background`,
            icon_angle: (subject, word) => `Geometric ${subject} ${word} icon, angles, pattern geometic art, nocrop, centered middle`,
            abstract: (subject, word) => `Abstract ${subject} creative ${word} representation, artistic, unique depiction`,
            close_up: (subject, word) => `Close-up, detailed ${subject} ${word}, high-focus, high-resolution 8k, bokeh, centered middle`,
            candid: (subject, word) => `Wide-angle candid photo of real ${subject} ${word}`,
            web_design: (subject, word) => `Design a professional ui/ux web design mock-up for ${subject} ${word}`,
            schematic: (subject, word) => `Illustrated a clear clean detailed schematic for ${subject} ${word}`,
            photograph: (subject, word) => `Sharp photograph of ${subject} ${word}. Use: good lighting, dof, correct color, good composition`,
            product_photography: (subject, word) => `Product photography shot of ${subject} ${word}, studio-quality`,
            corporate_art: (subject, word) => `Abstract illustration of ${subject} ${word}, corporate-art, minimalist, clean, high-resolution`, 
            bauhaus_art: (subject, word) => `Bauhaus ${subject} ${word} art, atristic illustration, abstract, angular, and geometric`, 
            clip_art: (subject, word) => `Standard clip are of ${subject} ${word}, detailed, nocrop, solid background`, 
            ink_art: (subject, word) => `Ink sketch of ${subject} ${word}, detailed, nocrop, white background`, 
            pop_art: (subject, word) => `Pop art style of ${subject} ${word}, detailed, nocrop, studio-quality, creative, colorful, vibrant`,
        };
    }


    get faq() {
        return {
            message: (subject, word) => `Generate ${this.aiRequestListLimit} frequently asked questions about ${subject} ${word}.`,
            functionName: "get_faq",
            properties: (subject, word) => ({
                "faq": {
                    "type": "array",
                    "description": `Array of frequently asked questions about "${subject} ${word}"`,
                    "items": {
                        "type": "string",
                        "description": `Frequently asked question about "${subject} ${word}"`
                    }
                }
            }),
            key: 'faq'
        };
    }

    get introductions() {
        return {
            message: (subject, word) => `Generate array ${this.aiRequestListLimit} various introductions for a ${subject} ${word}.`,
            functionName: "get_introductions",
            properties: (subject, word) => ({
                "introductions": {
                    "type": "array",
                    "description": `Array of introductions about "${subject} ${word}"`,
                    "items": {
                        "type": "string",
                        "description": `Introduction about "${subject} ${word}"`
                    }
                }
            }),
            key: 'introductions'
        };
    }

    get todos() {
        return {
            message: (subject, word) => `Generate comprehensive list of ${this.aiRequestListLimit} TODO items for ${subject} ${word}.`,
            functionName: "get_todo",
            properties: (subject, word) => ({
                "todos": {
                    "type": "array",
                    "description": `Array of detailed TODO steps for "${subject} ${word}"`,
                    "items": {
                        "type": "string",
                        "description": `TODO item for: "${subject} ${word}"`
                    }
                }
            }),
            key: 'todos'
        };
    }

    get books() {
        return {
            message: (subject, word) => `Identify ${this.aiRequestListLimit} books about ${subject} ${word}.`,
            functionName: "get_books",
            properties: (subject, word) => ({
                "books": {
                    "type": "array",
                    "description": `Array of books about "${subject} ${word}"`,
                    "items": {
                        "type": "string",
                        "description": `Book about "${subject} ${word}"`
                    }
                }
            }),
            key: 'books'
        };
    }

    get websites() {
        return {
            message: (subject, word) => `List ${this.aiRequestListLimit} websites about ${subject} ${word}.`,
            functionName: "get_websites",
            properties: (subject, word) => ({
                "websites": {
                    "type": "array",
                    "description": `Array of websites about "${subject} ${word}"`,
                    "items": {
                        "type": "string",
                        "description": `Website about "${subject} ${word}"`
                    }
                }
            }),
            key: 'websites'
        };
    }

    get tos() {
        return {
            message: (subject, word) => `Generate ${this.aiRequestListLimit} terms of service for ${subject} ${word}.`,
            functionName: "get_tos",
            properties: (subject, word) => ({
                "tos": {
                    "type": "array",
                    "description": `Array of terms of service for "${subject} ${word}"`,
                    "items": {
                        "type": "string",
                        "description": `Term of service for "${subject} ${word}"`
                    }
                }
            }),
            key: 'tos'
        };
    }

    get variations() {
        return {
            message: (subject, word) => `Generate ${this.aiRequestListLimit} variations of ${subject} ${word}.`,
            functionName: "get_variations",
            properties: (subject, word) => ({
                "variations": {
                    "type": "array",
                    "description": `Array of variations of "${subject} ${word}"`,
                    "items": {
                        "type": "string",
                        "description": `Variation of "${subject} ${word}"`
                    }
                }
            }),
            key: 'variations'
        };
    }

    get market_trends() {
        return {
            message: (subject, word) => `In the context of  ${subject}, generate ${this.aiRequestListLimit} market trends of ${word}.`,
            functionName: "get_market_trends",
            properties: (subject, word) => ({
                "market_trends": {
                    "type": "array",
                    "description": `Array of "${word}" market trends`,
                    "items": {
                        "type": "string",
                        "description": `market trend of "${subject} ${word}"`
                    }
                }
            }),
            key: 'market_trends'
        };
    }

    get legal_regulations() {
        return {
            message: (subject, word) => `Generate array of ${this.aiRequestListLimit} legal regulations of ${subject} ${word}.`,
            functionName: "get_legal_regulations",
            properties: (subject, word) => ({
                "legal_regulations": {
                    "type": "array",
                    "description": `Array of "${word}" legal regulations`,
                    "items": {
                        "type": "string",
                        "description": `legal regulation of "${subject} ${word}"`
                    }
                }
            }),
            key:  'legal_regulations'
        };
    }

    get employee_skills() {
        return {
            message: (subject, word) => `Generate array of ${this.aiRequestListLimit} employee skills of ${subject} ${word}.`,
            functionName: "get_employee_skills",
            properties: (subject, word) => ({
                "employee_skills": {
                    "type": "array",
                    "description": `Array of "${word}" employee skills`,
                    "items": {
                        "type": "string",
                        "description": `employee skill of "${subject} ${word}"`
                    }
                }
            }),
            key:  'employee_skills'
        };
    }

    get competitors() {
        return {
            message: (subject, word) => `Generate array of ${this.aiRequestListLimit} competitors of ${subject} ${word}.`,
            functionName: "get_competitors",
            properties: (subject, word) => ({
                "competitors": {
                    "type": "array",
                    "description": `Array of "${word}" competitors`,
                    "items": {
                        "type": "string",
                        "description": `competitor of "${subject} ${word}"`
                    }
                }
            }),
            key:  'competitors'
        };
    }

    get ux_styles() {
        return {
            message: (subject, word) => `Generate array of ${this.aiRequestListLimit} ui/ux styles of ${subject} ${word}.`,
            functionName: "get_ux_styles",
            properties: (subject, word) => ({
                "ux_styles": {
                    "type": "array",
                    "description": `Array of "${word}" ui/ux styles`,
                    "items": {
                        "type": "string",
                        "description": `style of "${subject} ${word}"`
                    }
                }
            }),
            key: 'ux_styles'
        };
    }

    get attributes() {
        return {
            message: (subject, word) => `Generate an array of ${this.aiRequestListLimit} attributes of ${subject} ${word}.`,
            functionName: "get_attributes",
            properties: (subject, word) => ({
                "attributes": {
                    "type": "array",
                    "description": `Array of "${word}" attributes`,
                    "items": {
                        "type": "string",
                        "description": `attribute of "${subject} ${word}"`
                    }
                }
            }),
            key: 'attributes'
        };
    }

    get types() {
        return {
            message: (subject, word) => `Generate an array of ${this.aiRequestListLimit} types of ${subject} ${word}.`,
            functionName: "get_types",
            properties: (subject, word) => ({
                "types": {
                    "type": "array",
                    "description": `Array of types of: ${subject} ${word}`,
                    "items": {
                        "type": "string",
                        "description": `types of "${subject} ${word}"`
                    }
                }
            }),
            key: 'types'
        };
    }

    get form_fields() {
        return {
            message: (subject, word) => `Generate an array of ${this.aiRequestListLimit} online form fields for ${subject} ${word}.`,
            functionName: "get_form_fields",
            properties: (subject, word) => ({
                "form_fields": {
                    "type": "array",
                    "description": `Array of online form fields for: ${subject} ${word}`,
                    "items": {
                        "type": "string",
                        "description": `fields for: "${subject} ${word}" form.`
                    }
                }
            }),
            key: 'form_fields'
        };
    }

    get how_to() {
        return {
            message: (subject, word) => `Write a 50 to 75 word how to guide about  how to: ${subject} ${word}.`,
            functionName: "get_how_to",
            properties: (subject, word) => ({
                "how_to": {
                    "type": "string",
                    "description": `50 to 75 word informative guide how to ${subject} ${word}`
                }
            }),
            key: 'how_to'
        };
    }

    get businesses_ideas() {
        return {
            message: (subject, word) => `Generate an array of ${this.aiRequestListLimit} business ideas for ${subject} ${word}.`,
            functionName: "get_businesses_ideas",
            properties: (subject, word) => ({
                "businesses_ideas": {
                    "type": "array",
                    "description": `Array of business ideas related to: ${subject} ${word}`,
                    "items": {
                        "type": "string",
                        "description": `business idea related to: ${subject} ${word}`
                    }
                }
            }),
            key: 'businesses_ideas'
        };
    }

    get related_words() {
        return {
            message: (subject) => `In the context of  ${subject}, create array of ${this.aiRequestListLimit} unique words related to "${word}". `,
            functionName: "get_related_words",
            properties: (subject) => ({
                "related_words": {
                    "type": "array",
                    "description": `Array of words related to: ${subject}`,
                    "items": {
                        "type": "string",
                        "description": `word related to: ${subject}  ${word}`
                    }
                }
            }),
            key: 'related_words'
        };
    }

    get examples() {
        return {
            message: (subject, word) => `In the context of  ${subject}, generate ${this.aiRequestListLimit} examples of ${word}s.`,
            functionName: "get_examples",
            properties: (subject, word) => ({
                "examples": {
                    "type": "array",
                    "description": `${this.aiRequestListLimit} popular examples of ${word}`,
                    "items": {
                        "type": "string",
                        "description": `example of ${subject} ${word}`
                    }
                }
            }),
            key: 'examples'
        };
    }

    get synonyms() {
        return {
            message: (word) => `In the context of  ${subject}, generate array of ${this.aiRequestListLimit} synonyms for: ${word}.`,
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

    get description() {
        return {
            message: (subject, word) => `Generate a brief detailed descriptions of ${subject} ${word}.`,
            functionName: "get_description",
            properties: (subject, word) => ({
                "description": {
                    "type": "string",
                    "description": `Informative description of ${subject} ${word}`
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
                    "description": `Informative definition of: ${subject} ${word}`
                }
            }),
            key: 'definition'
        };
    }

    get image_prompt() {
        return {
            message: (subject, word) => `Write a quality, visual, detailed, professional ai image generator prompt for: ${subject} ${word}.`,
            functionName: "get_image_prompt",
            properties: (subject, word) => ({
                "definition": {
                    "type": "string",
                    "description": ` Write a quality ai image generator prompt of ${subject} ${word}`
                }
            }),
            key: 'image_prompt'
        };
    }

    setLimit(limit) {
        if (typeof limit === 'number' && limit > 0) {
            this.aiRequestListLimit = limit;
        }
    }
}

export default AiRequestTemplates;
