import Encoder from "./Encoder.js";
import { STANDARD_ALPHABET } from "./consts.js";

/**
 * This class represents the plugboard. There is only one type of plugboard
 */
export default class PlugBoard extends Encoder {

	/**
	 * Constructor for the plugboard.
	 *
	 * @param {String} name - the name for the plugboard, defaults to 'plugboard'
	 * @param {EncoderSetup} [settings] - the settings for the plugboard. Only needed if
	 * 	using an alternate alphabet
	 */
	constructor(name = 'plugboard', settings = {}) {
		super(name, "Plugboard", settings);

		let {alphabet = STANDARD_ALPHABET, map} = settings;
		this.alphabet = alphabet;
		this.map = map || alphabet;
		this.rightMap = [];
		this.leftMap = [];
		this.plugs = '';
	}

	/**
	 * Call this method to configure the plug board. This will be used to
	 * provide the plug connections
	 *
	 * @public
	 *
	 * @param {Plugs} plugs - the configuration options for the plug board
	 */
	configure(plugs = []) {
		let map = this.map;
		/** @type {string[]} */

		if (typeof plugs === 'string') {
			plugs = plugs.split(' ');
		}
		plugs.forEach((plug) => {
			let firstIdx = this.alphabet.indexOf(plug[0]);
			let secondIdx = this.alphabet.indexOf(plug[1]);
			let first = map[firstIdx];
			let second = map[secondIdx];
			map = map.slice(0, firstIdx) + second + map.slice(firstIdx + 1);
			map = map.slice(0, secondIdx) + first + map.slice(secondIdx + 1);
		})

		this.rightMap = this.makeMap(map);
		this.leftMap = this.makeReverseMap(this.rightMap);

		this.plugs = plugs.join(' ');
	}

	/**
	 * Call this method to convert the input connector number to the output in
	 * the given direction.
	 *
	 * @public
	 *
	 * @param {Direction} direction - either right for moving towards the reflector or
	 * 	left if moving back
	 * @param {Number} input - the input connector
	 * @returns {Number} the output connector
	 */
	encode(direction, input) {
		let result = direction === 'right' ? this.rightMap[input]: this.leftMap[input];

		this.fireEncodeSet(input, result, direction);

		return result;
	}
}
