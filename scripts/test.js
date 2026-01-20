import '../package/lib/enigma/standardInventory.js'
import Enigma from "../package/lib/enigma/Enigma.js";
import Generator from '../package/lib/generator/Generator.js';
import CodeBook from '../package/lib/generator/CodeBook.js';
import { writeFile } from "node:fs/promises";

const WRITE = false;
const GENERATE_MESSAGES = false;
const GENERATE_CODEBOOK = true;

const TEST_MESSAGE_FILE = './test-messages.json';
const TEST_CODEBOOK_FILE = './test-codebook.json';

function generateForModel(model, count, list) {
	var generator = new Generator();

	let {reflectors, rotors, fixed} = generator.getModelOptions(model);
	let enigma = generator.createRandomEnigma(model, reflectors)

	for (let idx = 0; idx < count; idx++) {
		let configuration = generator.generateEnigmaConfiguration({rotors, fixed});
		enigma.configure(configuration);

		let message = generator.generateMessage(enigma);

		list.push({model, ...message});
	}
}

async function generateMessages(count) {
	let messages = [];

	generateForModel('I', count, messages);
	generateForModel('M3', count, messages);
	generateForModel('M4', count, messages);

	let output = JSON.stringify(messages, null, '    ');
	if (WRITE) {
		await writeFile(TEST_MESSAGE_FILE, output, 'utf-8');
	} else {
		console.log(output);
	}
}

async function codebook(count) {
	var generator = new Generator();

	let {reflectors} = generator.getModelOptions("I");
	let enigma = generator.createRandomEnigma("I", reflectors)
	let codeBook = new CodeBook(enigma);

	let keySheet = codeBook.generateKeySheet(30);

	let messages = [];

	for (let idx = 0; idx < count; idx++) {
		let message	= codeBook.generateMessage(keySheet);

		messages.push(message);
	}

	let output = JSON.stringify({keySheet, messages}, null, '    ');

	if (WRITE) {
		await writeFile(TEST_CODEBOOK_FILE, output, 'utf-8');
	} else {
		console.log(output);
	}
}

if (GENERATE_MESSAGES) {
	await generateMessages(20);
}

if (GENERATE_CODEBOOK) {
	await codebook(20);
}
