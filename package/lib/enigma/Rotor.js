import Encoder from "./Encoder.js";

/**
 * Create an instance of this class to construct a Rotor object. The Rotor class
 * encapsulates many of the peculiar behaviors of the Enigma. All connector
 * values here are specified in physical space.
 */
export default class Rotor extends Encoder {
	/**
	 * This is the constructor for the rotor.
	 *
	 * @param {String} name the name of the rotor; under normal circumstances
	 * 	this will be the string 'rotor-' plus the standard name for the rotor,
	 	* for example 'rotor-IV'
	 * @param {Object} settings an object that contains the various options that
	 * define the the rotor and how it is configured.
	 * @property [alphabet] set this to a string of letters that are an
	 * alternative to the standard A-Z. Defaults to A-Z
	 * @property {String} map a string that defines the mapping between the
	 * input and output connectors. The index into the string is the input
	 * connector and the value of this string at that index is the output
	 * connector. For example 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', which is the map
	 * for standard rotor I.
	 * @property {Number} [ringSetting] a number that specifies how far forward
	 * 	to offset the outer ring relative to the internal wiring.
	 * @property {String} turnovers a string that specifies the relative
	 * location of where on the rotor turnover will occur. The value here is the
	 * rotation value would be displayed in the window when turnover happens,
	 * expressed as a character. The standard rotors VI-VIII, available in the
	 * later model M3 had two turnover locations, M and Z. Pass an empty string
	 * when the rotor does not rotate during stepping
	 */
	constructor(name, settings) {
		super(name, settings);
		var { map, turnovers = '', ringSetting = 0} = settings

		this.map = [...map];
		this.rightMap = this.makeMap(map);
		this.leftMap = this.makeReverseMap(this.rightMap);
		this.length = map.length;
		this.ringOffset = ringSetting;

		this.turnoverLookup = this.makeMap(turnovers);
		this.offset = 0;
		if (turnovers === '') this.fixed = true;
		this.turnovers = this.turnoverLookup.reduce(function(turnovers, turnover) {
			turnovers[turnover] = true;
			return turnovers;
		}.bind(this), {});
	}

	/**
	 * Call this method to select the initial rotation of the rotor. This is a
	 * letter offset from the logical 0 connector. The initial rotation will
	 * also take into account the ring setting
	 *
	 * @param {String} connector This is a letter value that corresponds to what
	 * would appear in the rotation window. This value will be adjusted for the
	 * ring setting.
	 */
	setStartPosition(connector) {
		var pos = this.alphabet.indexOf(connector);
		this.offset = this.normalize(pos - this.ringOffset);
	}

	/**
	 * Call this method to map an input connector to an output connector when
	 * the signal is moving in the given direction. The input connector
	 * represents a physical location in real space. To get the logical
	 * connector for the rotor's zero point we need to adjust the connector
	 * number for the current rotation.
	 *
	 * @param {String} direction either right for moving towards the reflector or
	 * 	left if moving back
	 * @param {Number} input the connector in physical space
	 *
	 * @returns {Number} the output connector in physical space.
	 */
	encode(direction, input) {
		var map = direction === 'right' ? this.rightMap : this.leftMap;
		var evName = direction === 'right' ? 'encode-right' : 'encode-left';

		//find the logical position of the input connector in the wiring map
		var index = this.normalize(input + this.offset);

		// get the logical output connector and convert that to the physical
		// output connector
		var output = map[index];
		var result = this.normalize(output - this.offset);

		this.fire(evName, this.name,
			`${evName} ${this.name}, input: ${input} output: ${result} relative input: ${index}, relative output: ${output} rotation: ${this.offset}`,
			{
				input : input,
				output: result,
				logicalInput: index,
				logicalOutput: output,
				rotation: this.offset,
			}
		);

		return result;
	}

	/**
	 * Call this method to step the rotor
	 *
	 * @returns {Boolean} true true if the next rotor should be stepped
	 */
	step() {
		// Because the turnover notch is attached to the outer ring, and the
		// logical coordinates are based on the wiring, the logical position of
		// the notch for turnover needs to be adjusted to remove the ring offset.
		this.offset = this.normalize(this.offset + 1);
		var turnoverOffset = this.normalize(this.offset + this.ringOffset);

		// turnover happens when we step past the turnover point
		var turnover = this.turnovers[this.normalize(turnoverOffset - 1)];

		this.fire('step', this.name,
			`step ${this.name}, ${this.offset} ${this.normalize(this.offset + this.ringOffset)} ${turnoverOffset} ${Boolean(turnover)}`,
			{
				rotation: this.offset,
				ringSetting: this.ringOffset,
				turnover: Boolean(turnover),
			}
		);

		return turnover;
	}

	/**
	 * Call this method to see if the next step on this rotor will lead to
	 * turnover. The Enigma class will call this on the middle rotor to handle
	 * double stepping.
	 *
	 * @returns true if this rotor will turnover on the next step
	 */
	willTurnover() {
		var turnoverOffset = this.normalize(this.offset + this.ringOffset);

		// double stepping happens when we step to the turnover point
		return this.turnovers[turnoverOffset];
	}

	/**
	 * Call this method to find whether this is a fixed rotor. This is used for
	 * the non stepping rotors--beta and gamma--that are used in the M4
	 * @returns
	 */
	isFixed() {
		return this.fixed;
	}
}
