import Encoder from './Encoder.js';
import { STANDARD_ALPHABET } from "./consts.js";


/**
 * This is the class for an entry disc. Entry discs are fixed disks of connector
 * pins.
 */
export default class EntryDisc extends Encoder {
	/**
	 * Constructor for the entry disc.
	 *
	 * @param {String} name the name of this entry disc
	 * @param {Object} settings contains the alphabet being used, and the map
	 * 	between input and output contacts
	 */
	constructor(name, settings) {
		super(name, settings);
		var {map} = settings;
		this.rightMap = this.makeMap(map);
		this.leftMap = this.makeReverseMap(this.rightMap);
	}

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
