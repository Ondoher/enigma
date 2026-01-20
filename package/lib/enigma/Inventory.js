/**
 * This is the class used to manage the standard inventory of components. An
 * instance of this class is exported as the default of this module
 */

class Inventory {
	/**
	 * Constructor for the inventory class. Starts out empty
	 */
	constructor() {
		this.entryDiscs = {};
		/** @type {{[name: string]: RouterInventorySpec}}*/
		this.rotors = {};
		this.reflectors = {};
	}

	/**
	 * Call this method to add a new Rotor type to the inventory.
	 *
	 * @param {String} name the name of the rotor being added. This name will be
	 * 	used when specifying the rotors to use for the Enigma configuration.
	 * @param {String} map a string specifying the connector mapping. The index
	 * 	of the string is the logical coordinate of the connector, the character
	 * 	at that index is the output connector. To be exact, it would be the
	 * 	position of that character in the given alphabet. So, in the map '
	 * 	EKMFLGDQVZNTOWYHXUSPAIBRCJ', input connector 0 would map to output
	 * 	connector 4 and input connector 1 would map to output connector 10.
	 * 	Remember that the connectors are numbered starting at 0.
	 * @param {String} turnovers this is a string of characters representing the
	 * 	turnover locations on the disk. These letter would be the value shown in
	 * 	the window to during turnover. In Rotor I this is 'Q' in rotors VI, VII,
	 * 	and VIII there are two turnover locations, 'M' and 'Z'. Pass an empty
	 * 	string if this is a fixed rotor
	 */

	addRotor(name, map, turnovers) {
		this.rotors[name] = {map, turnovers}
	}

	/**
	 * Call this method to add a new reflector definition.
	 *
	 * @param {String} name this is the name that will be used to reference this
	 * 	reflector when constructing an Enigma class.
	 * @param {String} map the mapping between connectors. this uses the same
	 * 	format used in the addRotor method
	 */
	addReflector(name, map) {
		this.reflectors[name] = {map};
	}

	/**
	 * Call this method to add a new entry disc. There was only one used in the
	 * standard military models, but there were other versions that defined it
	 * differently.
	 *
	 * @param {*} name this is the name that will be used to reference this
	 * 	entry disc when constructing an Enigma class.
	 * @param {*} map the mapping between connectors. this uses the same format
	 * 	used in the addRotor method
	 */
	addEntryDisc(name, map) {
		this.entryDiscs[name] = {map};
	}

	/**
	 * Call this method to get the setup for a defined rotor.
	 *
	 * @param {String} name the name of the rotor as it was added to the
	 * 	inventory.
	 *
	 * @returns {Object} the rotor definition
	 * @property {String} map the connection map for the rotor
	 * @property {String} turnovers the locations where turnovers happen
	 */
	getRotor(name) {
		return this.rotors[name];
	}

	/**
	 * Call this method to get the setup for a defined reflector.
	 *
	 * @param {String} name the name of the reflector as it was added to the
	 * 	inventory.
	 * @returns {Object} the reflector definition
	 * @property {String} the connection map for the reflector
	 */
	getReflector(name) {
		return this.reflectors[name];
	}

	/**
	 * Call this method to get the setup for a defined entry disc.
	 *
	 * @param {String} name the name of the entry disc as it was added to the
	 * 	inventory.
	 * @returns {Object} the entry disc definition
	 * @property {String} the connection map for the entry disc
	 */
	getEntryDisc(name) {
		return this.entryDiscs[name];
	}

	/**
	 * Call this method to get the names of all the rotors in the inventory
	 *
	 * @param {boolean} [fixed] - if specified it returns only the names of
	 * routers filtered on if they are fixed or not, otherwise it returns all
	 *
	 * @returns {string[]} the names of the rotors
	 */
	getRotorNames(fixed) {
		if (fixed === undefined) {
			return Object.keys(this.rotors);
		}

		let entries = Object.entries(this.rotors);

		entries = entries.filter(([_name, rotor]) => {
			if (rotor.turnovers === '' && fixed) {
				return true;
			}
			if (rotor.turnovers !== '' && !fixed) {
				return true;
			}

			return false;
		})

		return entries.map(([name, _router]) => name);
	}
}


export default new Inventory();
