import { STANDARD_ALPHABET } from "./consts.js";


/**
 * This is the base class for an encoder. The default implementation of the
 * encode method is to return the input as the output
 */
export default class Encoder {
	/**
	 * Constructor for the base encoder
	 *
	 * @param {string} name
	 * @param {ComponentType} type
	 * @param {EncoderSetup} settings
	 */
	constructor(name, type, settings) {
		let {cb, alphabet = STANDARD_ALPHABET} = settings;
		this.name = name;
		this.type = type;
		this.alphabet = alphabet;
		this.contactCount = alphabet.length;
		/** @type {{[name: string]: Listener}} */
		this.listeners = {}

		if (cb) {
			this.listeners["constructor"] = cb;
		}
	}

	/**
	 * given a connector number, normalize it to be between 0 and 25 inclusive.
	 *
	 * @param {Number} connector the connector being normalized
	 *
	 * @returns {Number} value between 0 and 25
	 */
	normalize(connector) {
		return (connector + this.contactCount * 2) % this.contactCount;
	}

	/**
	 *
	 * @param {string} letter
	 *
	 * @returns {boolean}
	 */
	verifyLetter(letter) {
		if (letter.length !== 1 || this.alphabet.indexOf(letter) === -1) {
			if (letter !== ' ') {
				console.warn(`Unexpected character ${letter}`);
			}
			return false;
		}

		return true;
	}

	/**
	 * Call this method to convert a letter to a connector value
	 *
	 * @param {string} letter
	 * @returns {number | undefined}
	 */
	letterToConnector(letter) {
		if (!this.verifyLetter(letter)) {
			return;
		}

		return this.alphabet.indexOf(letter);
	}

	/**
	 * Call this method to turn a connector to a letter value
	 *
	 * @param {number} connector
	 * @returns {string | undefined}
	 */
	connectorToLetter(connector) {
		if (connector >= this.alphabet.length) {
			console.warn(`Unexpected connector ${connector}`);

		}

		return this.alphabet[connector];
	}

	/**
	 * Given an alphabetic connection map, convert that into an array of
	 * numbers. The index into the array or string is the input connector, and
	 * the value at that position is the output connector
	 *
	 * @param {String} map connections map.
	 * @returns {Array.<Number>} the numerical map
	 */
	makeMap(map) {
		var letters = [...map];
		return letters.map(function(letter) {
			return this.alphabet.indexOf(letter);
		}, this)
	}

	/**
	 * given an existing connection map from input to out put, create a new map
	 * that has the connections going in the other direction, output to input.
	 *
	 * @param {Array.<Number>} map connection map
	 * @returns {Array.<Number>} the reversed map
	 */
	makeReverseMap(map) {
		var reverseMap = new Array(map.length);

		map.forEach(function(input, idx) {
			reverseMap[input] = idx;
		}, this);

		return reverseMap;
	}

	/**
	 * Call this method to convert the input connector number to the output in
	 * the given direction The default encode method just passes the input value
	 * through
	 *
	 * @param {Direction} _direction either right for moving towards the reflector
	 * 	or left if moving back
	 * @param {Number} input the specific connection receiving an input
	 *
	 * @returns {Number} The translated output connector number
	 */
	encode(_direction, input) {
		return input;
	}

	/**
	 *
	 * @param {number | string} start
	 * @param {number | string} stop
	 * @param {Direction} direction
	 */
	fireEncodeSet(start, stop, direction) {
		/** @type {EventData} */
		let eventData = {
			name: this.name,
			type: this.type,
			description: `input: ${start}`,
			event: 'input',
			input: start
		}

		this.fire('input', this.name, eventData);

		if (typeof start === 'number') start = this.connectorToLetter(start)
		if (typeof stop === 'number') stop = this.connectorToLetter(stop)
		eventData = {
			name: this.name,
			type: this.type,
			description: `${this.type}: ${this.name} translate ${start} to ${stop}`,
			event: 'translate',
			direction,
			start,
			stop
		}
		this.fire('translate', this.name, eventData);

		eventData = {
			name: this.name,
			type: this.type,
			description: `output: ${stop}`,
			event: 'output',
			output: stop
		}
		this.fire('output', this.name, eventData);
	}

	/**
	 * Call this method to add a function to be called when important events
	 * happen to a component. The name can be used to later remove the listener
	 *
	 * @param {string} name - the name of the listener
	 * @param {Listener} cb - the function to be called.
	 */
	listen(name, cb) {
		this.listeners[name] = cb;
	}

	/**
	 * Call this method to remove a listener
	 *
	 * @param {string} name - the name of the listener
	 */
	unlisten(name) {
		delete this.listeners[name];
	}

	/**
	 * Call this method to call any event listeners
	 *
	 * @param {EventName} event - the event being fired
	 * @param {String} name - the name of the component firing the event
	 * @param {EventData} data - the event data
	 */
	fire(event, name, data) {
		let listeners = Object.values(this.listeners);
		for (let cb of listeners) {
			cb(event, name, data)
		}
	}

}
