import Encoder from './Encoder.js';
import { STANDARD_ALPHABET } from './consts.js';

/**
 * Make in instance of this class to construct a reflector
 */
export default class Reflector extends Encoder {

	/**
	 * constructor for the reflector class.
	 *
	 * @param {String} name the name of the reflector instance
	 * @param {EncoderSetup} settings The definition of the reflector
	 */
	constructor(name, settings) {
		super(name, "Reflector", settings);
		var {map = STANDARD_ALPHABET} = settings;

 		this.map = this.makeMap(map);
	}

	/**
	 * Call this method when reversing the encoding direction of the Enigma. As
	 * the point where direction changes this does not have a distinction
	 * between a left and right signal path.
	 *
	 * @param {Direction} direction since this is the point where signal direction
	 * changes from right to left this parameter is not used.
	 * @param {Number} input this is the input connector
	 *
	 * @returns {Number} the mapped output connector
	 */
	encode(direction, input) {
		var result = this.map[input];

		this.fireEncodeSet(input, result, direction)

		return result;
	}
}
