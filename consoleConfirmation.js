
import readline from 'readline';

async function askQuestion(rl, question) {
    return new Promise(resolve => {
        rl.question(question, resolve);
    });
}

async function getQuestion(termString) {
    return `
y to process, 
enter to skip \n
${termString}\n`;
}

async function consoleConfirmation(termString){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    const answer = await askQuestion(rl, getQuestion(termString));

    return answer === 'y';

}

export default consoleConfirmation;