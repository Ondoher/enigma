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
export default class Enigma extends Encoder {
	/**
	 * The constructor for the Enigma. This represents the unconfigurable
	 * settings of the device.
	 *
	 * @param {string} name - the name of the enigma
	 * @param {EnigmaSetup} settings - the setup options
	 */
	constructor(name,  settings) {
		super(name, "Enigma", settings)
		let {entryDisc = 'default', reflector, alphabet = STANDARD_ALPHABET} = settings;
		let entryDiscSettings = inventory.getEntryDisc(entryDisc)

		let reflectorSettings = inventory.getReflector(reflector)
		this.alphabet = alphabet;
		this.plugboard = new PlugBoard('default', {});
		this.entryDisc = new EntryDisc('default', entryDiscSettings);
		this.reflector = new Reflector(reflector, reflectorSettings)
		this.length = alphabet.length;
		/** @type {Rotor[]} */
		this._rotors = [];
		/** @type {{[rotor: number]: boolean}} */
		this.pending = [];
		/** @type {Encoder[]} */
		this.encoders = [];
		/**@type {SimplifiedConfiguration & {reflector: string}} */
		this._configuration = {reflector, ringSettings: [], rotors: [], plugs: ''};
	}

	/**
	 * the configured rotors
	 *
	 * @public
	 *
	 * @return {Rotor[]}
	 */
	get rotors() {
		return this._rotors;
	}

	/**
	 * The configuration and setup options
	 *
	 * @public
	 *
	 * @returns {SimplifiedConfiguration & {reflector: string}}
	 */
	get configuration() {
		return this._configuration;
	}

	/**
	 * Configure the Enigma for encoding.
	 *
	 * @public
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

		// because the rotors are specified in the reverse order they are used,
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
			return new Rotor(`${name}`, {...inventory.getRotor(name), alphabet: this.alphabet, ringSetting: ringOffsets[idx], cb: this.cb});
		}, this);

		this.encoders = [this.plugboard, this.entryDisc, ...this.rotors];

		this._configuration = {...this._configuration,
			rotors,
			ringSettings: ringOffsets,
			plugs: this.plugboard.plugs
		}
	}

	/**
	 * Call this method to "step" the rotors one time. This method will manage the
	 * stepping between all rotors
	 *
	 * @public
	 */
	step() {
		// Only the notches on the first two rotors effect stepping. One rotor's
		// alphabet ring prevents the next rotor from turning unless the first
		// rotor's notch is exposed. When a rotor does step, so does the
		// previous  rotor  because they are attached by the notch in the
		// previous rotor's  ring

		// precalculate if and why a rotor should step, the first rotor is
		// always engaged
		/** @type {{engaged:boolean, nextEngaged: boolean}[]} */
		let step = []

		step[0] = {engaged: true, nextEngaged: false};

		for (let idx = 1; idx < 3; idx++) {
			let engaged = this._rotors[idx - 1].atTurnover();
			let nextEngaged = idx < 2 && this._rotors[idx].atTurnover();

			step[idx] = {engaged, nextEngaged};
		}

		this._rotors.forEach((rotor, idx) => {
			if (rotor.isFixed()) return;

			if (step[idx].engaged || step[idx].nextEngaged) {
				rotor.step();
			}

			// the double-step is caused by the the next rotor stepping
			if (step[idx].nextEngaged) {
				/** @type {EventData} */
				let eventData = {
					name: rotor.name,
					description: `rotor ${rotor.name} double stepping from ${rotor.offset}`,
					type: this.type,
					event: "double-step",
					offset: rotor.offset,
				}
				this.fire('double-step', rotor.name, eventData);
			}
		});
	}

	/**
	 * Call this method to set the starting rotation for the messages to encrypt
	 *
	 * @public
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

		start = [...start].reverse().join('');
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
	 * @public
	 *
	 * @param {String} letter - the key pressed
	 * @returns {String | undefined} the encoded letter
	 */
	keyPress(letter) {
		letter = letter.toUpperCase();
		if (!this.verifyLetter(letter)) {
			return;
		}

		let connector = this.letterToConnector(letter);
		this.fireInput(letter, "right");
		this.step();

		// encode to the right
		connector =  this.encoders.reduce(function(connector, encoder, idx) {
			connector = encoder.encode('right', connector);
			return connector;
		}.bind(this), this.alphabet.indexOf(letter));

		// reflector
		connector = this.reflector.encode('turn-around', connector);

		// encode to the left
		connector = this.encoders.reduceRight(function(connector, encoder) {
			connector = encoder.encode('left', connector);
			return connector;
		}.bind(this), connector)

		const outputLetter = this.connectorToLetter(connector);

		this.fireOutput(outputLetter, "left");
		this.fireTranslate(letter, outputLetter, "end-to-end");
		return outputLetter;
	}

	/**
	 * Call this shortcut method to encode a whole string
	 *
	 * @public
	 *
	 * @param {String} start - the starting position for the rotors
	 * @param {String} text - the text to encode
	 *
	 * @returns {String} the encoded string.
	 */
	translate(start, text) {
		this.setStart(start)
		let letters = [...text];
		let output = letters.map(function(letter) {
			return this.keyPress(letter);
		}, this)

		return output.join('');
	}

	/**
	 * Call this method to add a function to be called when important events
	 * happen to a component. This listener will be propagated to all installed
	 * components. The name can be used to later remove the listener
	 *
	 * @public
	 *
	 * @param {string} name - the name of the listener
	 * @param {Listener} cb - the function to be called.
	 */
	listen(name, cb) {
		super.listen(name, cb);

		for (let encoder of this.encoders) {
			encoder.listen(name, cb)
		}

		this.reflector.listen(name, cb);
	}

	/**
	 * Call this method to unregister a listener. The listener will also be
	 * removed from all components
	 *
	 * @public
	 *
	 * @param {string} name - the name of the listener
	 */

	unlisten(name) {
		super.unlisten(name);

		for (let encoder of this.encoders) {
			encoder.unlisten(name)
		}
	}

}
