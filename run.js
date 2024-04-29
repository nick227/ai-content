import AiContentGenerator from "./AiContentGenerator.js";

async function main() {
    const app = new AiContentGenerator({ commands: ['examples'] });
    const res = await app.run('geography', 'city');
    console.log(JSON.stringify(res, null, 2));
}

main();
