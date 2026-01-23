
import Enigma from '../enigma/Enigma.js';
import '../enigma/standardInventory.js';
import sentences from './hamlet.js'
import inventory from '../enigma/Inventory.js';
import { STANDARD_ALPHABET } from '../enigma/consts.js';
import Random from '../utils/Random.js';


/**
 * Use this class to generate random enigma configurations and messages. The
 * methods in this class all the use the `Random` object, which can be seeded to
 * produce a reproducible output
 */
export default class Generator {
	constructor() {}

	/**
	 * Call this method to turn a string into valid characters for encryption,
	 * which is just the letters A-Z.
	 *
	 * @param {String} text the original text
	 * @returns {String} the text that has been normalized to what the Enigma
	 * 	can process
	 */
	cleanMessage(text) {
		text = text.toUpperCase();
		text = text.replace(/[^A-Z]/g, '');

		return text
	}

	/**
	 * Call this method to break a string into groups of five letters with a
	 * space between them.
	 *
	 * @param {string} text - the original text
	 * @param {number} [size] - the size of the text groups, defaults to 5
	 *
	 * @returns {string} the segmented string
	 */
	groupText(text, size = 5) {
		let textArray = [...text];
		let result = textArray.reduce((text, letter, idx) => {
			text = text + letter;
			if (Math.floor(idx % size) === size - 1) text = text + ' ';
			return text;
		}, '');

		return result;
	}

	/**
	 * Call this method to generate the given number of sentences. The sentences
	 * are pulled from the text of Hamlet.
	 *
	 * @param {Number} count the number of sentences
	 * @returns {String} the sentences separated by a ' ';
	 */
	generateSentences(count) {
		return Random.chooseRange(count, sentences);
	}

	/**
	 * Call this method to get the possible setup and configuration options for
	 * the given model
	 *
	 * @param {Model} model
	 *
	 * @returns {ModelOptions}
	 */
	getModelOptions(model) {
		switch (model) {
			case 'I':
				return {
					rotors: ['I', 'II', 'III', 'IV', 'V'],
					reflectors: ['A', 'B', 'C'],
					fixed: false
				};
			case "M3":
				return {
					rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
					reflectors: ['A', 'B', 'C'],
					fixed: false
				}
			case "M4":
				return {
					reflectors: ['Thin-B', 'Thin-C'],
					rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
					fixed: ['Beta', 'Gamma'],
				}
		}
	}

	/**
	 * Call this method to generate a random Enigma configuration
	 *
	 * @param {GeneratorSetup} [setup] options for settings

	 * @returns {SimplifiedConfiguration} the Enigma settings.
	 */
	generateEnigmaConfiguration(setup = {}) {
		/** @type {number []} */
		let connectors = [...Array(26).keys()];
		/** @type {string[]} */
		let letters = [...STANDARD_ALPHABET];
		let unfixed = inventory.getRotorNames(false);
		let fixed = inventory.getRotorNames(true);
		let useRotors = structuredClone(setup.rotors || unfixed);
		let rotors = Random.pick(3, useRotors);
		let ringSettings = Random.choose(3, connectors);
		let plugsList = Random.pickPairs(10, letters);

		plugsList = plugsList.map((pair) => pair.join(""));

		ringSettings[0]++;
		ringSettings[1]++;
		ringSettings[2]++;

		let plugs = plugsList.join(' ');

		if (setup.fixed) {
			let useRotors = structuredClone(Array.isArray(setup.fixed) ? setup.fixed : fixed);
			rotors.push(Random.pickOne(useRotors));
			ringSettings.push(Random.chooseOne(connectors));
			ringSettings[3]++;
		}

		return {rotors, plugs, ringSettings};
	}

	/**
	 *
	 * @param {string[]} [reflectors] if given, specifies and alternate list of
	 * reflectors. Defaults to ['A', 'B', 'C'];
	 */
	createRandomEnigma(model = "Enigma", reflectors = ['A', 'B', 'C']) {
		let reflector = Random.pickOne(reflectors);
		return new Enigma(model, {model, reflector});
	}

	/**
	 * Call this method to generate a random message text encoded with the given
	 * Enigma. The random text will be a few sentences from Hamlet.
	 *
	 * @param {Enigma} enigma
	 *
	 * @returns {GeneratedMessage} details of the generated text
	 */
	generateMessage(enigma) {
		let count = Random.random(3) + 2;

		let decoded = this.cleanMessage(this.generateSentences(count));
		let start = Random.choose(enigma.rotors.length, [...STANDARD_ALPHABET]).join('');

		let encoded = enigma.encode(start, decoded);

		return {start, encoded, decoded, configuration: enigma.configuration};
	}
}
