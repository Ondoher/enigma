import { STANDARD_ALPHABET } from './consts.js';
import Encoder from './Encoder.js';


/**
 * This is the class for an entry disc. Entry discs are fixed disks of connector
 * pins.
 */
export default class EntryDisc extends Encoder {
	/**
	 * Constructor for the entry disc.
	 *
	 * @param {String} name the name of this entry disc
	 * @param {EncoderSetup} settings contains the alphabet being used, and the map
	 * 	between input and output contacts
	 */
	constructor(name, settings) {
		super(name, settings);
		var {map = STANDARD_ALPHABET} = settings;
		this.rightMap = this.makeMap(map);
		this.leftMap = this.makeReverseMap(this.rightMap);
	}

	/**
	 *
	 * @param {Direction} direction either right for moving towards the reflector
	 * 	or left if moving back
	 * @param {Number} input the specific connection receiving an input
	 *
	 * @returns {Number} The translated output connector number
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
