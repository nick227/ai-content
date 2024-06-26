
import fs from 'fs';
import path from 'path';
import url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveB64Image(b64_json, subject, word, prompt) {
    const baseDir = path.join(process.cwd(), '/public/uploads/images/');
    const buffer = Buffer.from(b64_json, 'base64');
    const image = `${makeFileNameSafeForWindows(prompt)}-${Date.now()}.jpg`;
    const imagePath = path.join(baseDir, image);
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
    fs.writeFileSync(imagePath, buffer);
    return image;
}

function makeFileNameSafeForWindows(name) {
    const illegalChars = /[\u0000-\u001F<>:"\/\\|?*.,;(){}[\]!@#$%^&+=`~]/g;
    const maxLength = 200;
    let safeName = name.replace(illegalChars, '').replace(/\.{2,}/g, '.').trim().replace(/(^[. ]+|[. ]+$)/g, '');
    const reservedNames = ["CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9", "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"];
    if (reservedNames.includes(safeName.toUpperCase())) safeName = 'file';
    return safeName.slice(0, maxLength);
}

export default saveB64Image;