import { STANDARD_ALPHABET } from "./consts.js";
import Encoder from "./Encoder.js";

/**
 * Create an instance of this class to construct a Rotor object. The Rotor class
 * encapsulates many of the peculiar behaviors of the Enigma. All connector
 * values here are specified in physical space.
 *
 * There are three positioning systems to keep in mind. There is the logical
 * position that map an input to an output as defined by the wiring. There is
 * the physical position of the rotor in space as related to the location of the
 * connectors, the rotation offset. And there is an additional adjustment, the
 * ring setting, that moves the internal wiring against the rotational position.
 */
export default class Rotor extends Encoder {
	/**
	 * This is the constructor for the rotor.
	 *
	 * @param {String} name - the name of the rotor
	 * @param {RotorSetup} settings - an object that contains the various options that
	 * define the the rotor and how it is configured.
	 */
	constructor(name, settings) {
		super(name, "Rotor", settings);
		let { map = STANDARD_ALPHABET, turnovers = '', ringSetting = 0} = settings

		this._settings = structuredClone(settings);
		this.map = [...map];
		this.rightMap = this.makeMap(map);
		this.leftMap = this.makeReverseMap(this.rightMap);
		this.length = map.length;
		this.ringOffset = ringSetting;

		this.turnoverLookup = this.makeMap(turnovers);
		this.offset = 0;
		if (turnovers === '') this.fixed = true;
		this.turnovers = turnovers;
		/** @type {Set<number>} */
		let turnoverSet = new Set();
		this._turnovers = this.turnoverLookup.reduce((turnovers, turnover) => {
			turnovers.add(turnover)
			return turnovers;
		}, turnoverSet);
	}

	/**
	 * @returns {RotorSetup}
	 */
	get settings() {
		return this._settings;
	}

	// get offset() {
	// 	return this._offset
	// }

	/**
	 * Call this method to select the initial rotation of the rotor. This is a
	 * letter offset from the logical 0 connector. The initial rotation will
	 * also take into account the ring setting
	 *
	 * @public
	 *
	 * @param {String} connector - This is a letter value that corresponds to
	 * what would appear in the rotation window. This value will be adjusted for
	 * the ring setting.
	 */
	setStartPosition(connector) {
		let pos = this.alphabet.indexOf(connector);
		this.offset = this.normalize(pos - this.ringOffset);
	}

	/**
	 * Call this method to map an input connector to an output connector when
	 * the signal is moving in the given direction. The input connector
	 * represents a physical location in real space. To get the logical
	 * connector for the rotor's zero point we need to adjust the connector
	 * number for the current rotation.
	 *
	 * @public
	 *
	 * @param {Direction} direction - either right for moving towards the reflector or
	 * 	left if moving back
	 * @param {Number} input - the connector in physical space
	 *
	 * @returns {Number} the output - connector in physical space.
	 */
	encode(direction, input) {
		let map = direction === 'right' ? this.rightMap : this.leftMap;

		//find the logical position of the input connector in the wiring map
		let index = this.normalize(input + this.offset);

		// get the logical output connector and convert that to the physical
		// output connector
		let output = map[index];
		let result = this.normalize(output - this.offset);

		this.fireEncodeSet(input, result, direction);
		return result;
	}

	/**
	 * Call this method to step the rotor. This is only responsible for updating
	 * the internal state. Double stepping is done by the enigma class
	 *
	 * @public
	 */
	step() {
		// let start = this.offset;

		// // do the step
		// this.offset = this.normalize(this.offset + 1);

		// let stop = this.offset;

		// Because the turnover notch is attached to the outer ring, and the
		// logical coordinates are based on the wiring, the logical position of
		// the notch for turnover needs to be adjusted to remove the ring offset.
		let start = this.offset;
		this.offset = this.normalize(this.offset + 1);
		let stop = this.offset;
		let turnoverOffset = this.normalize(this.offset + this.ringOffset);

		// turnover happens when we step past the turnover point
		let turnover = this._turnovers.has(this.normalize(turnoverOffset - 1));
		let turnoverStr = turnover ? 'with turnover' : ''

		/** @type {EventData} */
		let eventData = {
			name: this.name,
			type: this.type,
			description: `Rotor "${this.name}" stepped from ${start} to ${stop}${turnoverStr}`,
			event: 'step',
			turnover, start, stop
		}

		this.fire('step', this.name, eventData);

		return turnover;
	}

	/**
	 * Call this method to see if the router turnover notch is exposed.
	 *
	 * @public
	 *
	 * @returns true if it is, false otherwise
	 */
	atTurnover() {
		let currentOffset = this.normalize(this.offset + this.ringOffset);
		return this._turnovers.has(currentOffset);
	}


	/**
	 * Call this method to find whether this is a fixed rotor. This is used for
	 * the non stepping rotors--beta and gamma--that are used in the M4
	 * @public
	 *
	 * @returns
	 */
	isFixed() {
		return this.fixed;
	}
}
