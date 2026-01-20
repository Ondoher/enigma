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
	 * @param {EncoderSetup} settings
	 */
	constructor(name, settings) {
		let {cb, alphabet = STANDARD_ALPHABET} = settings;
		this.name = name;
		this.alphabet = alphabet;
		this.contactCount = alphabet.length;
		this.cb = cb;
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
	 * Call this method to set a function to be called when important events
	 * happen to a component.

	 * @param {Listener} cb the function to be called.
	 */
	listen(cb) {
		this.cb = cb;
	}

	/**
	 * Call this method to call the event listener
	 *
	 * @param {String} name the name of the event
	 * @param  {unknown[]} rest the parameters to pass to the callback
	 */
	fire(name, ...rest) {
		if (this.cb) this.cb(name, ...rest);
	}

}
