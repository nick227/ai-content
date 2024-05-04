import AiContentGenerator from "./includes/AiContentGenerator.js";

/*
chat:
description
synonyms
examples
related_words
image_prompt
definition
description
businesses_ideas
form_fields

dalle:
    professional
    creative
    icon
    abstract
    closeUp
    candid
    examples
    webDesign
*/

async function main() {
    const app = new AiContentGenerator({ commands: ['examples'] });
    const res = await app.run('geography', 'city');
    console.log(JSON.stringify(res, null, 2));
}

//main();
