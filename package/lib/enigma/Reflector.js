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
	 * @param {Obect} The definition of the reflector
	 * @property {String} [alphabet] a string of letters that are an alternative
	 * 	to the standard A-Z. Defaults to A-Z
	 * @property {String} map a string that defines the mapping between the
	 * input and output connectors. The index into the string is the input
	 * connector and the value of this string at that index is the output
	 * connector. For example, 'YRUHQSLDPXNGOKMIEBFZCWVJAT' which is the map for
	 * standard reflector B.
	 */
	constructor(name, settings) {
		super(name, settings);
		var {map} = settings;

 		this.map = this.makeMap(map);
	}

	/**
	 * Call this method when reversing the encoding direction of the Enigma. As
	 * the point where direction changes this does not have a distinction
	 * between a left and right signal path.
	 *
	 * @param {String} direction since this is the point where signal direction
	 * changes from right to left this parameter is not used.
	 * @param {Number} input this is the input connector
	 *
	 * @returns {Number} the mapped output connector
	 */
	encode(direction, input) {
		var result = this.map[input];
		this.fire('encode', this.name,
			`encode ${this.name} ${input} ${result}`,
			{
				input: input,
				output: result,
			});

		return result;
	}
}
