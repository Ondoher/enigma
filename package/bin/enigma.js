import parseArgs  from 'minimist';
import { getOptions } from '../lib/utils/options.js';
import { access, constants, readFile, writeFile } from 'node:fs/promises';
import { CONFIG } from './config.js';
import Enigma from 'enigma/Enigma';

let argv = parseArgs(process.argv.slice(2));
let params = argv._;
let instructionText = '';

/** @type {Options} */
let defaultOptions = {
	file: './enigma.json',
	overwrite: false,
	events: '',
	step: false
}

/** @type {OptionsNameMap} */
let nameMap = {
	file: 'f',
	overwrite: 'o',
	events: 'e',
	step: 's'
}


/** @type {Options} */
let options = getOptions(defaultOptions, argv, nameMap);
let command = params[0];

/**
 * Call this function to check if a file exists
 *
 * @param {String} name
 * @returns {Promise<boolean>}
 */
async function fileExists(name) {
	try {
		await access(name, constants.R_OK | constants.W_OK);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * Call this method to see if the config file exists
 * @returns
 */
async function configExists() {
	return await fileExists(options.file)
}

/**
 *
 * @returns {Promise<EnigmaConfig>}
 */
async function readConfig() {
	if (!configExists) {
		return CONFIG;
	}

	return JSON.parse(await readFile( options.file, 'utf-8'));

}

function instructions() {
	console.log(instructionText);
}

/**
 *
 * @param {string} str
 */
function error(str) {
	console.log(str);
}

async function init() {
	if (await configExists() && !options.overwrite) {
		error("cannot overwrite config file")
		instructions();
		return;
	}

	await writeFile(options.file, JSON.stringify(CONFIG, null, "    "), 'utf-8');
}

async function runEnigma() {
	let config = await readConfig();
	if (params.length > 1) {
		config.encode = params[1];
	}
	let enigmaConfig = config.enigma;
	if (!config.encode) {
		error('no string to encode');
		instructions();
		return;
	}
	let { name, rotors, ringSettings, reflector, plugs} = enigmaConfig;
	let enigma = new Enigma(name, {reflector});
	enigma.configure({rotors, ringSettings, plugs})
	let decoded = enigma.translate("", config.encode)
}

async function main() {
	instructionText = await readFile('./instructions.txt', 'utf-8');
	if (!command) {
		instructions();
		return;
	}

	switch (command) {
		case "init":
			await init();
 			break;

		default:
			instructions();
			break;
	}
}

await main();
