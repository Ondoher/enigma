import Encoder from "./Encoder.js";
import { STANDARD_ALPHABET } from "./consts.js";

/**
 * This class represents the plugboard. There is only one type of plugboard
 */
export default class PlugBoard extends Encoder {

	/**
	 * Constructor for the plugboard.
	 *
	 * @param {String} name the name for the plugboard, defaults to 'plugboard'
	 * @param {Object} [settings] the settings for the plugboard. Only needed if
	 * 	using an alternate alphabet
	 */
	constructor(name = 'plugboard', settings = {}) {
		super(name, settings);

		var {alphabet = STANDARD_ALPHABET, map} = settings;
		this.alphabet = alphabet;
		this.map = map || alphabet;
	}

	/**
	 * Call this method to configure the plug board. This will be used to
	 * provide the plug connections
	 *
	 * @param {Object} [settings] the configuration options for the plug
	 * 	board
	 * @property {Array.<String>|String} [plugs] either an array of strings or a
	 * 	single string. If it is a string, it must be a space separated list of
	 * 	letter pairs that connects one input letter to another. If it is an
	 * array then then each item is a pair of letters to specify how the plugs
	 * are connected
	 */
	configure(settings = {}) {
		var map = this.map;
		var {plugs = []} = settings;

		if (typeof plugs === 'string') plugs = plugs.split(' ');
		plugs.forEach(function(plug) {
			var firstIdx = this.alphabet.indexOf(plug[0]);
			var secondIdx = this.alphabet.indexOf(plug[1]);
			var first = map[firstIdx];
			var second = map[secondIdx];
			map = map.slice(0, firstIdx) + second + map.slice(firstIdx + 1);
			map = map.slice(0, secondIdx) + first + map.slice(secondIdx + 1);
		}, this)

		this.rightMap = this.makeMap(map);
		this.leftMap = this.makeReverseMap(this.rightMap);
	}

	/**
	 * Call this method to convert the input connector number to the output in
	 * the given direction.
	 *
	 * @param {String} direction either right for moving towards the reflector or
	 * 	left if moving back
	 * @param {Number} input the input connector
	 * @returns {Number} the output connector
	 */
	encode(direction, input) {
		var result = direction === 'right' ? this.rightMap[input]: this.leftMap[input];
		var evName = direction === 'right' ? 'encode-right' : 'encode-left';
		this.fire(evName, this.name,
			`${evName} ${this.name}, input: ${input}, output: ${result}`, {
				input: input,
				output: result,
			}
		);
		return result;
	}
}
