import { json } from '@sveltejs/kit';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const load = async () => {
    const filePath = join(__dirname, '../../static/data/resume.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log("data", data.skills);
    return {
        profile: data
    };
};