import '../lib/enigma/standardInventory.js'
import Enigma from "../lib/enigma/Enigma.js";
import Generator from '../lib/generator/Generator.js';
import CodeBook from '../lib/generator/CodeBook.js';
import { writeFile } from "fs/promises";
import { enigmaData } from './EnigmaData.js';

const WRITE = false;
const GENERATE_MESSAGES = false;
const GENERATE_CODEBOOK = false;
const SHOW_EVENTS = true;
const EVENT_TYPES = ["translate", "input", "output", "step", "double-step"];
const EVENT_MESSAGE = enigmaData.sampleFieldMessages[0];


const TEST_MESSAGE_FILE = './test-messages.json';
const TEST_CODEBOOK_FILE = './test-codebook.json';

/**
 *
 * @param {string} model
 * @param {number} count
 * @param {GeneratedMessage[]} list
 */
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

/**
 *
 * @param {number} count
 */
async function generateMessages(count) {
	/** @type {object[]} */
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

/**
 *
 * @param {number} count
 */
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

function showEvents() {
	let enigma = new Enigma(EVENT_MESSAGE.model, {reflector: EVENT_MESSAGE.setup.reflector});
	enigma.configure({plugs: EVENT_MESSAGE.setup.plugs, rotors: EVENT_MESSAGE.setup.rotors, ringSettings: EVENT_MESSAGE.setup.ringSettings});

	enigma.listen('showEvents', (event, name, data) => {
		if (EVENT_TYPES.includes(event)) {
			console.log(data.description);
		}
	})

	let encoded = enigma.translate(EVENT_MESSAGE.message.key, EVENT_MESSAGE.message.decoded);

	console.log(encoded);
	console.log(EVENT_MESSAGE.message.encoded);
}


if (GENERATE_MESSAGES) {
	await generateMessages(20);
}

if (GENERATE_CODEBOOK) {
	await codebook(20);
}

if (SHOW_EVENTS) {
	showEvents();
}
