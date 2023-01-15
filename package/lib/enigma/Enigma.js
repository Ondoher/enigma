import EntryDisc from "./EntryDisc.js";
import PlugBoard from "./PlugBoard.js";
import Rotor from "./Rotor.js";
import Reflector from "./Reflector.js";
import inventory from './Inventory.js'
import { STANDARD_ALPHABET } from "./consts.js";

/**
 * Construct this class to get a new instance of the Enigma. Many of the
 * parameters to the constructor and the config method reference the names of
 * standard Enigma parts. These are retrived from the Inventory instance
 */
export default class Enigma {
	/**
	 * The constructor for the Enigma. This represents the unconfigurable
	 * settings of the device.
	 *
	 * @param {Object} settings the settings for the Enigma
	 * @property {String} [entryDisc] the name of entry disc in the inventory
	 * this defaults 'default'
	 * @param {String} reflector specifies one of possible reflectors, the
	 * predefined reflectors are A, B, C, Thin-B and Thin-C
	 * @param {String} [alphabet] the alphabet used by the system, usually just
	 *	the uppercase latin letters
	 */
	constructor(settings) {
		var {entryDisc = 'default', reflector, alphabet = STANDARD_ALPHABET} = settings;
		var entryDiscSettings = inventory.getEntryDisc(entryDisc)

		var reflectorSettings = inventory.getReflector(reflector)
		this.alphabet = alphabet;
		this.plugboard = new PlugBoard('plugboard', {});
		this.entryDisc = new EntryDisc('entry-disc', entryDiscSettings);
		this.reflector = new Reflector('reflector', reflectorSettings)
		this.length = alphabet.length;
	}

	/**
	 * Call this method to normalize a connector number to be within the
	 * the length of the currrent alphabet
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
	 * Configure the Enigma for encoding.
	 *
	 * @param {Object} settings the configuration of the Enigma. These settings
	 * represent the aspects of the Enigma that can can change for daily
	 * configuration.
	 * @property {Array.<String>|String} [plugs] array of strings with each
	 * 	element being a pair of letters from the alphabet that are being swapped
	 * 	on the plug board
	 * @property {Array.<String>} rotors the array of installed rotors. The
	 * 	order here is signicant and is given in the left to right direction.
	 * 	This means that last name in this list is the first rotor used in the
	 * 	forward direction and last used in the backward direction. Each element
	 * 	is the name of the rotor to use in the corresponding position. Stepping
	 * 	stops at the first fixed rotor
	 * @property {String|Array<Number>} [ringSettings] each letter in this
	 * 	string represents the offset of the key settings from the rotor start
	 * 	position. If it is an array, then each value is the one based key
	 * 	setting for the related rotor,
	 */
	configure(settings) {
		var { rotors, ringSettings = [], plugs = [] } = settings;

		// make copies of these configurations so that we don't change the
		// values from the caller, which in JavaScript are passed by reference.
		rotors = JSON.parse(JSON.stringify(rotors));
		ringSettings = JSON.parse(JSON.stringify(ringSettings));

		// the rotors are given in the left to right direction, but are actually
		// used in the right to left direction. So, here we reverse them
		rotors = rotors.reverse();

		this.plugboard.configure({plugs})

		var ringOffsets = []

		// because the rotors are secified in the reverse other they are used,
		// we have to do the same for the ringSettings.
		if (Array.isArray(ringSettings)) {
			ringSettings = ringSettings.reverse();

			// When specified with numbers they will be in the range 1-26, we
			// need to shift these to be 0-25;
			ringSettings.forEach(function(offset) {
				ringOffsets.push(this.normalize(offset - 1))
			}, this);
		} else {
			var letters = [...ringSettings];
			letters = letters.reverse();
			letters.forEach(function(letter) {
				var offset = this.alphabet.indexOf(letter);
				ringOffsets.push(offset);
			}, this)
		}

		this.rotors = rotors.map(function(name, idx) {
			return new Rotor(`rotor-${name}`, {...inventory.getRotor(name), alphabet: this.alphabet, ringSetting: ringOffsets[idx], cb: this.cb});
		}, this);

		this.encoders = [this.plugboard, this.entryDisc, ...this.rotors];
	}

	/**
	 * Call this method to step the rotors one time. This method will manage the
	 * stepping between all rotors
	 */
	step() {
		this.rotors.forEach(function(rotor, idx) {
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
	 * @param {Array.Number>|String} the length of the string or the array
	 * 	should match the number of rotors and are given left to right. If start
	 * 	is a string then the letters of the string specify the start value seen
	 * 	in the window for the corresponding rotor. If it is an array then each
	 * 	number will be the one-based rotation.
	 */
	setStart(start) {
		if (Array.isArray(start)) {
			var charArray = start.map(function(number) {
				number--;
				return this.alphabet[number];
			}, this);

			start = charArray.join('');
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
	 * @returns {String} the encoded letter
	 */
	keyPress(letter) {
		letter = letter.toUpperCase();
		if (letter.length !== 1 || this.alphabet.indexOf(letter) === -1) {
			if (letter !== ' ')
				console.warn(`Unexected character ${letter}`);
			return;
		}

		this.fire('input', this.name, `input ${letter}`, {letter})
		this.step();

		// encode to the right
		var connector =  this.encoders.reduce(function(connector, encoder) {
			connector = encoder.encode('right', connector);
			return connector;
		}.bind(this), this.alphabet.indexOf(letter));

		// reflector
		connector = this.reflector.encode('', connector);

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
	 * @param {String} start the starting positon for the rotors
	 * @param {String} text the text to encode
	 *
	 * @returns {String} the encoded string.
	 */
	encode(start, text) {
		this.setStart(start)
		var letters = [...text];
		var output = letters.map(function(letter) {
			return this.keyPress(letter);
		}, this)

		return output.join('');
	}

	/**
	 * Call this method to call the event listener
	 *
	 * @param {String} name the name of the event
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
