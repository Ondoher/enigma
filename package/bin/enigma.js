import parseArgs  from 'minimist';
import { getOptions } from '../lib/utils/options.js';
import { access, constants, readFile, writeFile } from 'node:fs/promises';
import { CONFIG } from './config.js';

import Enigma from '../lib/enigma/Enigma.js';
import Rotor from '../lib/enigma/Rotor.js';
import Generator from '../lib/generator/Generator.js';
import Random from '../lib/utils/Random.js';
import { STANDARD_ALPHABET } from '../lib/enigma/consts.js';
import { ClParser } from './ClParser.js';

let argv = parseArgs(process.argv.slice(2));
let params = argv._;

let parser = new ClParser(params);

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


/** @type {Model[]} */
let models = ["I", "M3", "M4"];

/** @type {Options} */
// process them once to find the config file
let options = getOptions(defaultOptions, argv, nameMap);
let command = params[0];
let generator = new Generator();

let config = await readConfig();
defaultOptions = {...defaultOptions, ...config.options}

// process them again to update the options with the config defaults
options = getOptions(defaultOptions, argv, nameMap)


/**
 *
 * @param {any} value
 * @returns {any}
 */
function any(value) {
	return value;
}


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
	if (!configExists()) {
		return CONFIG;
	}

	return JSON.parse(await readFile( options.file, 'utf-8'));
}

/**
 *
 * @param {EnigmaConfig} config
 */
async function writeConfig(config) {
	await writeFile(options.file, JSON.stringify(config, null, "    "), 'utf-8');
}

function instructions() {
	console.log(instructionText);
}

/**
 *
 * @param {EnigmaSpec} config
 * @param {string} [key]
 *
 * @returns {string | true}
 */
function verify(config, key) {
	let length = config.rotors.length;

	/** {@type {Set<string>}} */
	let haveRotors = new Set();

	for (let rotor of config.rotors) {
		if (haveRotors.has(rotor)) {
			return "cannot duplicate rotors";
		}
	}

	if (config.ringSettings.length !== length) {
		return 'ring setting length must match the number of rotors'
	}

	if (key && key.length !== length) {
		return 'key length must match the number of rotors'
	}

	return true;
}

/**
 *
 * @param {string} str
 */
function showError(str) {
	console.log(str);
}

function output(str) {
	console.log(str);
}

async function init() {
	if (await configExists() && !options.overwrite) {
		showError("cannot overwrite config file")
		instructions();
		return;
	}

	let model = models[Random.random(3)];
	let id = Random.random(65535);
	let spec = makeEnigmaSpec(model, id);
	let config = structuredClone(CONFIG);

	config.enigma = spec;

	await writeConfig(CONFIG)
	writeFile(options.file, JSON.stringify(config, null, "    "), 'utf-8');
}

/**
 *
 * @param {Model} model
 * @param {number} seed
 */
function getEnigmaFromSeed(model, seed) {
	let {reflectors, fixed, rotors } = generator.getModelOptions(model)

	Random.randomize(seed);

	let setup = generator.generateEnigmaSetup(model, reflectors);
	let configuration = generator.generateEnigmaConfiguration({fixed, rotors})

	return {setup, configuration};
}

/**
 *
 * @param {Model} model
 * @param {number} seed
 */
function makeEnigmaSpec(model, seed) {
	let {setup, configuration} = getEnigmaFromSeed(model, seed);

	let {reflector} = setup;

	let {rotors, ringSettings, plugs} = configuration;

	return{seed, model, reflector, rotors, ringSettings,plugs}
}

async function make() {
	// [seed] [model] [reflector] [rotors] [plugs] [ringSettings]

	let defaultModel = models[Random.random(3)];
	let defaultSeed = Random.random(65535);
	let spec = makeEnigmaSpec(defaultModel, defaultSeed);

	let defaultReflector = parser.parseReflector(spec.reflector);
	let defaultRotors = parser.parseRotors(spec.rotors.join(' '));
	let defaultRingSettings = spec.ringSettings;
	let defaultPlugs = spec.plugs;


	/** @type {ParserFields} */
	let fields = {
		seed: {defaultVal: defaultSeed},
		model: {defaultVal: defaultModel},
		reflector: {defaultVal: defaultReflector},
		rotors: {defaultVal: defaultRotors},
		plugs: {defaultVal: defaultPlugs},
		ringSettings: {defaultVal: defaultRingSettings},
	}

	/**
	 * @type {{
	 *		seed: number;
	 *		model: Model | false;
	 *   	reflector: ParsedReflector | false;
	 * 		rotors: string[] | false;
	 * 		plugs: string[] | false;
	 * 		ringSettings: number[] | false;
	 * 		error?: ParseError
	 * }}
	 */
	const results = any(parser.parseParams(fields, (type, parsed, value, parsers, results) => {
		if (type === 'model') {
			let seed = results.seed;
			// they specified a new seed, set the defaults to the enigma from seed
			if (results) {
				if (results.seed !== defaultSeed) {
					let modelName = value;
					if (parsed === false) {
						// use the seed to get a new model
						Random.randomize(results.seed);
						modelName = models[Random.random(3)];
					}
					let model = generator.getModelType(modelName);
					if (!model) {
						return;
					}
					let spec = makeEnigmaSpec(model, seed);

					results.model = model;
					parsers.reflector.defaultVal = parser.parseReflector(spec.reflector);
					parsers.rotors.defaultVal = parser.parseRotors(spec.rotors.join(' '));
					parsers.ringSettings.defaultVal = spec.ringSettings;
					parsers.plugs.defaultVal = spec.plugs;
				}
			}
		}

		return true;
	}));

	let {seed, model, reflector, rotors, plugs, ringSettings, error} = results;

	if (error) {
		showError(error.message);
		instructions();
		return;
	}

	if (!model || !reflector ||! rotors || !plugs || !ringSettings) {
		return;
	}

	/** @type {EnigmaSpec} */
	let enigmaConfig = {seed, model, reflector: reflector.name, rotors, plugs, ringSettings}

	let verified = verify(enigmaConfig);
	if (verified !== true) {
		showError(verified);
		instructions();
		return;
	}

	config.enigma = enigmaConfig;

	await writeConfig(config);
}

/**
 *
 * @param {object} obj
 * @param {string[]} properties
 *
 * @returns {string | true}
 */
function exists(obj, properties) {
	/** @type {string[]} */
	let errors = [];

	for (let property of properties) {
		if (obj[property] === false || obj[property] === undefined) {
			errors.push(`${property} is required`);
		}
	}

	if (errors.length === 0) {
		return true;
	}

	return errors.join('\n');
}

function encode() {
	// [seed] [model] [reflector] [rotors] [plugs] [ringSettings] [keys] [message]
	let enigmaConfig = config.enigma;

	/** @type {ParserFields} */
	let fields = {
		seed: {defaultVal: enigmaConfig?.seed || -1},
		model: {defaultVal: enigmaConfig?.model},
		reflector: {defaultVal: parser.parseReflector(enigmaConfig?.reflector)},
		rotors: {defaultVal: enigmaConfig?.rotors ? parser.parseRotors(enigmaConfig?.rotors?.join(' ')) : false},
		plugs: {defaultVal: enigmaConfig?.plugs},
		ringSettings: {defaultVal: enigmaConfig?.ringSettings},
		keys: {defaultVal: config.encode?.key},
		message: {defaultVal: config.encode?.message}
	}

	/**
	 * @type {{
	 *		seed: number,
	 *		model: Model | false,
	 *   	reflector: ParsedReflector | false,
	 * 		rotors: string[] | false,
	 * 		plugs: string[] | false,
	 * 		ringSettings: number[] | false
	 * 		keys: string | false,
	 * 		message: string | false
	 * }}
	 */
	const results = any(parser.parseParams(fields, (type, _parsed, value, parsers, results) => {
		if (type === 'model') {
			let seed = results.seed;
			// they specified a new seed, set the defaults to the enigma from seed
			if (seed !== -1 && seed !== config.enigma?.seed) {
				let modelName = value;
				let model = generator.getModelType(modelName);
				if (!model) {
					return;
				}
				let spec = makeEnigmaSpec(model, seed);

				parsers.reflector.defaultVal = parser.parseReflector(spec.reflector);
				parsers.rotors.defaultVal = parser.parseRotors(spec.rotors.join(' '));
				parsers.ringSettings.defaultVal = spec.ringSettings;
				parsers.plugs.defaultVal = spec.plugs;
			}
		}

		return true;
	}));

	let {seed, model, reflector, rotors, plugs, ringSettings, keys, message} = results;
	let valid = exists(results, ['model', 'reflector', 'rotors', 'plugs', 'ringSettings', 'keys', 'message']);

	if (valid !== true) {
		showError(valid)
		instructions();
		return;
	}

	if (!model || !reflector ||! rotors || !plugs || !ringSettings || !keys || !message) {
		return;
	}

	/** @type {EnigmaSpec} */
	let enigmaSetup = {
		seed,
		model,
		reflector: reflector.name,
		rotors,
		ringSettings,
		plugs
	}

	let verified = verify(enigmaSetup, keys);
	if (verified !== true) {
		showError(verified);
		instructions();
		return;
	}

	if (!message) {
		showError('no message');
		instructions();
		return;
	}

	let enigma = new Enigma(model, {reflector: reflector.name});
	enigma.configure({rotors, ringSettings, plugs})
	let decoded = enigma.translate(keys, message);

	output(decoded)
}


function rotor() {
	/*
		[name] [direction] [ringSetting] [key] [message]
	*/

	let defaultRotorName = config.rotor?.name;
	let defaultRotor = parser.parseRotor(defaultRotorName)
	/** @type {ParserFields} */
	let fields = {
		'rotor': {defaultVal: defaultRotor},
		'direction': {defaultVal: 'right'},
		'ringSetting': {defaultVal: 0},
		'key': {defaultVal: 'A'},
		'message': {defaultVal: config.encode.message},
	}

	let values = parser.parseParams(fields);

	/** @type {{name: string, rotor: RotorInventorySpec}} */
	let rotorResult = values.rotor;
	/** @type {Direction} */
	let direction = values.direction;
	/** @type {number} */
	let ringSetting = values.ringSetting;
	/** @type {string} */
	let key = values.key;
	/** @type {string} */
	let message = values.message;


	if (!rotorResult) {
		showError('no rotor specified');
		instructions();
		return;
	}

	let rotorName = rotorResult.name;
	let rotorSpec = rotorResult.rotor;

	if (!message) {
		showError('no message specified');
		instructions();
	}

	let rotor = new Rotor(rotorName, {ringSetting, ...rotorSpec});
	rotor.setStartPosition(key || 'A');
	for (let char of message || '') {
		let input = STANDARD_ALPHABET.indexOf(char.toUpperCase());
		let output = rotor.encode(direction || 'right', input);
		rotor.step();
	}
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

		case "make":
			await make();
			break;

		case "rotor":
			rotor();
			break;

		case 'encode':
			encode();
			break;

		default:
			instructions();
			break;
	}
}

await main();
