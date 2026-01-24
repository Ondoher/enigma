import '../package/lib/enigma/standardInventory.js'
import Generator from '../package/lib/generator/Generator.js';
import { writeFile } from "fs/promises";

let messages = [];

let generator = new Generator();

function generateI(count, list) {
	for (let idx = 0; idx < count; idx++) {
		let message = generator.generateEncodedText({
			rotors: ['I', 'II', 'III', 'IV', 'V'],
			reflectors: ['A', 'B', 'C'],
		})
		list.push({model: 'I', ...message});
}
}

function generateM3(count, list) {
	for (let idx = 0; idx < count; idx++) {
		let message = generator.generateEncodedText({
			rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VII'],
			reflectors: ['A', 'B', 'C'],
		});
		list.push({model: 'M3', ...message});
	}
}

function generateM4(count, list) {
	for (let idx = 0; idx < count; idx++) {
		let message = generator.generateEncodedText({
			reflectors: ['Thin-B', 'Thin-C'],
			rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
			fixed: ['Beta', 'Gamma'],
		})
		list.push({model: 'M4', ...message});
	}
}


let messages = [];

generateI(20, messages);
generateM3(20, messages);
generateM4(20, messages);

await writeFile('./test-messages.json', JSON.stringify(messages, null, '    '), 'utf-8');
