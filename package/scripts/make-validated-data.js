import { enigmaData } from "./EnigmaData.js";
import { writeFile } from "fs/promises";

await writeFile('./validated-messages.json', JSON.stringify(enigmaData, null, '    '), 'utf-8');
