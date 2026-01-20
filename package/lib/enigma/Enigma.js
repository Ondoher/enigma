import EntryDisc from "./EntryDisc.js";
import PlugBoard from "./PlugBoard.js";
import Rotor from "./Rotor.js";
import Reflector from "./Reflector.js";
import inventory from './Inventory.js'
import { STANDARD_ALPHABET } from "./consts.js";
import Encoder from "./Encoder.js";

/**
 * Construct this class to get a new instance of the Enigma. Many of the
 * parameters to the constructor and the config method reference the names of
 * standard Enigma parts. These are retrieved from the Inventory instance
 */
export default class Enigma {
	/**
	 * The constructor for the Enigma. This represents the unconfigurable
	 * settings of the device.
	 *
	 * @param {EnigmaSetup} settings
	 */
	constructor(settings) {
		let {entryDisc = 'default', reflector, alphabet = STANDARD_ALPHABET, model = "Enigma"} = settings;
		let entryDiscSettings = inventory.getEntryDisc(entryDisc)

		let reflectorSettings = inventory.getReflector(reflector)
		this.alphabet = alphabet;
		this.plugboard = new PlugBoard('plugboard', {});
		this.entryDisc = new EntryDisc('entry-disc', entryDiscSettings);
		this.reflector = new Reflector('reflector', reflectorSettings)
		this.length = alphabet.length;
		/** @type {Rotor[]} */
		this._rotors = [];
		/** @type {{[rotor: number]: boolean}} */
		this.pending = [];
		this.name = model;
		/** @type {Encoder[]} */
		this.encoders = [];
		/**@type {SimplifiedConfiguration & {reflector: string}} */
		this._configuration = {reflector}
	}

	/**
	 * Call this method to normalize a connector number to be within the
	 * the length of the current alphabet
	 *
	 * @param {Number} connector the number to be normalized
	 *
	 * @returns {Number} the normalized connector number
	 */
	normalize(connector) {
		connector += this.length;
		connector = connector % this.length

		return connector;
	}

	/**
	 * the configured rotors
	 *
	 * @return {Rotor[]}
	 */
	get rotors() {
		return this._rotors;
	}

	/**
	 * @returns {SimplifiedConfiguration & {reflector: string}}
	 */
	get configuration() {
		return this._configuration;
	}

	/**
	 * Configure the Enigma for encoding.
	 *
	 * @param {EnigmaConfiguration} settings - the configuration of the Enigma.
	 * These settings represent the aspects of the Enigma that can can change for daily
	 * configuration.
	 */
	configure(settings) {
		let { rotors, ringSettings = [], plugs = [] } = settings;

		// make copies of these configurations so that we don't change the
		// values from the caller, which in JavaScript are passed by reference.
		let useRotors = structuredClone(rotors);
		ringSettings = structuredClone(ringSettings);

		// the rotors are given in the left to right direction, but are actually
		// used in the right to left direction. So, here we reverse them
		useRotors = useRotors.reverse();

		this.plugboard.configure(plugs)

		/** @type {number[]} */
		let ringOffsets = []

		// because the rotors are specified in the reverse other they are used,
		// we have to do the same for the ringSettings.
		if (Array.isArray(ringSettings)) {
			ringSettings = ringSettings.reverse();

			// When specified with numbers they will be in the range 1-26, we
			// need to shift these to be 0-25;
			ringSettings.forEach(function(offset) {
				ringOffsets.push(this.normalize(offset - 1))
			}, this);
		} else {
			let letters = [...ringSettings];
			letters = letters.reverse();
			letters.forEach(function(letter) {
				let offset = this.alphabet.indexOf(letter);
				ringOffsets.push(offset);
			}, this)
		}

		this._rotors = useRotors.map(function(name, idx) {
			return new Rotor(`rotor-${name}`, {...inventory.getRotor(name), alphabet: this.alphabet, ringSetting: ringOffsets[idx], cb: this.cb});
		}, this);

		this.encoders = [this.plugboard, this.entryDisc, ...this.rotors];

		this._configuration = {...this._configuration,
			rotors,
			ringOffsets,
			plugs: this.plugboard.plugs
		}
	}

	/**
	 * Call this method to step the rotors one time. This method will manage the
	 * stepping between all rotors
	 */
	step() {
		this._rotors.forEach(function(rotor, idx) {
			if (rotor.isFixed()) return;

			// This is the double stepping. Only do this for the middle rotor
			if (rotor.willTurnover() && idx === 1) {
				this.pending[idx] = true
			};

			if (this.pending[idx]) {
				this.pending[idx] = false;
				if (rotor.step()) this.pending[idx + 1] = true;
			}
		}, this);

		// The first rotor is always stepping
		this.pending[0] = true;
	}

	/**
	 * Call this method to set the starting rotation for the messages to encrypt
	 *
	 * @param {number[]|string} setup - length of the string or the array
	 * 	should match the number of rotors and are given left to right. If start
	 * 	is a string then the letters of the string specify the start value seen
	 * 	in the window for the corresponding rotor. If it is an array then each
	 * 	number will be the one-based rotation.
	 */
	setStart(setup) {
		let start = '';
		if (Array.isArray(setup)) {
			let charArray = setup.map(function(number) {
				number--;
				return this.alphabet[number];
			}, this);

			start = charArray.join('');
		} else {
			start = setup;
		}

		start = [...start].reverse();

		// reset the rotation pending state
		this.pending = {0: true};

		this.rotors.forEach(function(rotor, idx) {
			rotor.setStartPosition(start[idx]);
		})
	}

	/**
	 * Call this method to simulate a keypress on the Enigma. This will output
	 * the encoded letter
	 *
	 * @param {String} letter the key pressed
	 * @returns {String | undefined} the encoded letter
	 */
	keyPress(letter) {
		letter = letter.toUpperCase();
		if (letter.length !== 1 || this.alphabet.indexOf(letter) === -1) {
			if (letter !== ' ')
				console.warn(`Unexpected character ${letter}`);
			return;
		}

		this.fire('input', this.name, `input ${letter}`, {letter})
		this.step();

		// encode to the right
		let connector =  this.encoders.reduce(function(connector, encoder, idx) {
			connector = encoder.encode('right', connector);
			return connector;
		}.bind(this), this.alphabet.indexOf(letter));

		// reflector
		connector = this.reflector.encode('right', connector);

		// encode to the left
		connector = this.encoders.reduceRight(function(connector, encoder) {
			connector = encoder.encode('left', connector);
			return connector;
		}.bind(this), connector)

		letter = this.alphabet[connector];
		this.fire('output', this.name, `output ${letter}`, {letter})
		return letter;
	}

	/**
	 * Call this shortcut method to encode a whole string
	 *
	 * @param {String} start the starting position for the rotors
	 * @param {String} text the text to encode
	 *
	 * @returns {String} the encoded string.
	 */
	encode(start, text) {
		this.setStart(start)
		let letters = [...text];
		let output = letters.map(function(letter) {
			return this.keyPress(letter);
		}, this)

		return output.join('');
	}

	/**
	 * Call this method to call the event listener
	 *
	 * @param {String} type the name of the event
	 * @param  {...any} rest the parameters to pass to the callback
	 */
	fire(type, ...rest) {
		if (this.cb) this.cb(type, ...rest);
	}

	/**
	 * Call this method to set a function to be called when important events
	 * happen to a component.

	 * @param {Listener} cb the function to be called.
	 */
	listen(cb) {
		this.cb = cb;
		this.encoders.forEach(function(encoder) {
			encoder.listen(cb);
		});

		this.reflector.listen(cb);
	}
}
