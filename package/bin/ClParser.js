import Generator from '../lib/generator/Generator.js';
import Inventory from '../lib/enigma/Inventory.js';


export class ClParser {
	/**
	 *
	 * @param {string[]} params
	 */
	constructor (params) {
		this.params = params;
		/** @type {{[name: string]: Parser}} */
		this.parsers = {};
		this.setupParsers();
	}

	/**
	 *
	 * @param {string} name
	 * @param {Parser} parser
	 */
	addParser(name, parser) {
		this.parsers[name] = parser;
	}

	setupParsers() {
		this.addParser('rotor', this.parseRotor.bind(this));
		this.addParser('direction', this.parseDirection.bind(this));
		this.addParser('ringSetting', this.parseRingSetting.bind(this));
		this.addParser('key', this.parseKey.bind(this));
		this.addParser('message', this.parseMessage.bind(this));
		this.addParser('seed', this.parseSeed.bind(this));
		this.addParser('model', this.parseModel.bind(this));
		this.addParser('reflector', this.parseReflector.bind(this));
		this.addParser('rotors', this.parseRotors.bind(this));
		this.addParser('plugs', this.parsePlugs.bind(this));
		this.addParser('ringSettings', this.parseRingSettings.bind(this));
		this.addParser('keys', this.parseKeys.bind(this));
	}

	/**
	 *
	 * @param {string} param
	 * @returns {boolean}
	 */
	isNumber(param) {
		return !Number.isNaN(Number(param))
	}

	/**
	 *
	 * @param {string} param
	 * @returns {string}
	 */
 	spread(param) {
		param = param.replaceAll(',', ' ');
		param = param.replaceAll(/ +/g, ' ');

		return param
	}

	/**
	 *
	 * @param {string} param
	 * @returns {string | false}
	 */
	parseMessage(param) {
		return param ?? false;
	}



	/**
	 *
	 * @param {string} param
	 * @return {string | false}
	 */
	parseKeys(param) {
		param = param.toUpperCase();
		let letters = [...param];
		if (letters.length > 4 || letters.length < 3) {
			return false;
		}

		for (let letter of letters) {
			if (letter < "A" || letter > 'Z') {
				return false;
			}
		}

		return param;
	}





	/**
	 *
	 * @param {string} param
	 * @returns {string[] | false}
	 */
	parseRotors(param) {
		param = this.spread(param);

		let parts = param.split(' ');
		if (parts.length < 3 || parts.length > 4) {
			return false;
		}

		/** @type {string[]} */
		let rotors = [];
		for(let idx = 0; idx < parts.length; idx++) {
			let name = parts[idx];
			if (idx < 3) {
				let rotor = Inventory.getRotor(name);
				if (!rotor || rotor.turnovers === '') {
					return false;
				}

				rotors.push(name);
			} else {
				let rotor = Inventory.getRotor(name);
				if (!rotor || rotor.turnovers !== '') {
					return false;
				}

				rotors.push(name)
			}
		}

		return rotors;
	}

	/**
	 *
	 * @param {string} param
	 * @returns {number[] | false}
	 */
	parseRingSettings(param) {
		param = this.spread(param);
		let parts = param.split(" ");


		if (parts.length < 3 || parts.length > 4) {
			return false;
		}

		/** @type {number[]} */
		let result = [];
		for (let part of parts) {
			if (!this.isNumber(part)) {
				return false;
			}

			let setting = parseInt(part);

			if (setting < 0 || setting > 25) {
				return false;
			}

			result.push(setting)
		}

		return result;
}

	/**
	 *
	 * @param {string} param
	 * @returns {string[] | false | ParseError}
	 */
	parsePlugs(param) {
		/** @type {Set<string>} */
		const has = new Set();
		param = param.toUpperCase();

		// see if it looks like plugs
		let toCheck = this.spread(param).toUpperCase();
		let allLetters = [...toCheck.replaceAll(" ", '')].every((char) => char >= 'A' && char <= 'Z');
		let notLetters = [...toCheck.replaceAll(" ", '')].reduce((count, char) => char < 'A' || char > 'Z' ? count+1 : count, 0);
		let spaceCount = [...toCheck].reduce((count, char) => char === ' ' ? count + 1 : count, 0);
		let hasSpaces = toCheck.includes(' ');
		let parts = toCheck.split(' ');
		let max = parts.reduce((max, part) => Math.max(max, part.length), 0);
		let min = parts.reduce((min, part) => Math.min(min, part.length), Number.MAX_SAFE_INTEGER);

		// determine if this is supposed to be plugs
		let isPlugs =
			(hasSpaces && notLetters < spaceCount / 2 && max <= 3) ||
			(!hasSpaces && allLetters && max === 2 && min === 2);

		console.log({param, toCheck, allLetters, notLetters, spaceCount, hasSpaces, parts, min, max, isPlugs});

		if (!isPlugs) {
			return false;
		}

		if (max > 2 || min < 2) {
			return {error: true, message: 'Plugs must come in pairs'}
		}

		if (notLetters > 0) {
			return {error: true, message: 'Plugs must consist of only letters'}
		}

		let chars = [...toCheck.replaceAll(" ", '')];
		for (let char of chars) {
			if (has.has(char)) {
				return {error: true, message: 'Cannot repeat plugs'};
			}

			has.add(char);
		}

		let pairs = param.split(" ");
		if (pairs.length > 10) {
			return {error: true, message: 'Cannot have more than ten plug definitions'};
		}

		/** @type {string[]} */
		let result = [];
		for (let pair of pairs) {
			if (pair.length !== 2) {
				return false;
			}
			result.push(pair);
		}

		return result;
	}

	/**
	 *
	 * @param {string} name
	 *
	 * @returns {ParsedRotor| false}
	 */
	parseRotor(name) {
		let rotor = Inventory.getRotor(name);

		return rotor ? {name, rotor} : false;
	}


	/**
	 *
	 * @param {string} param
	 * @returns {number | false}
	 */
	parseSeed(param) {
		if (!this.isNumber(param)) {
			return false;
		}

		return Number(param);
	}

	/**
	 *
	 * @param {string} param
	 * @return {Model | false}
	 */
	parseModel(param) {
		const generator = new Generator();
		return generator.getModelType(param);
	}

	/**
	 *
	 * @param {string} name
	 * @return {ParsedReflector | false}
	 *
	 */
	parseReflector(name) {
		const reflector = Inventory.getReflector(name);

		return reflector ? {name, reflector} : false
	}

	/**
	 *
	 * @param {string} param
	 * @returns {number | false}
	 */
	parseRingSetting(param) {
		if (!this.isNumber(param)) {
			return false;
		}

		let ringSetting = parseInt(param);
		if (ringSetting < 0 || ringSetting > 25) {
			return false;
		}

		return ringSetting;
	}

	/**
	 *
	 * @param {string} param
	 * @returns {Direction | false}
	 */
	parseDirection(param) {
		if (param === 'right') {
			return 'right';
		}
		if (param === 'left') {
			return 'left';
		}

		return false;
	}

	/**
	 *
	 * @param {string} param
	 * @returns {string | false}
	 */
	parseKey(param) {
		if (!param || param.length !== 1) {
			return false;
		}

		param = param.toUpperCase();

		if (param[0] < 'A' || param[0] > 'Z') {
			return false;
		}

		return param;
	}

	/**
	 *
	 * @param {ParserFields} fields
	 * @param {ParsedHandler} [handler]
	 * @returns {ParsedResults}
	 */
	parseParams(fields, handler) {
		let next = 1;
		let keys = Object.keys(fields);
		/** @type {ParsedResults} */
		let result = {}
		for (let key of keys) {
			let {defaultVal} = fields[key];
			let param = this.params[next];
			let cb = this.parsers[key];
			/** @type {ParseError | any} */
			let cbResult = false;

			if (!cb) {
				result[key] = defaultVal;
			} else if (this.params.length <= next) {
				result[key] = defaultVal;
			} else {
				cbResult = cb(param)
				if (cbResult === false) {
					result[key] = defaultVal;
				} else if (cbResult.error) {
					result.error = cbResult;

					return result;
				} else {
					result[key] = cbResult;
					next++
				}
			}

			if (handler) {
				handler(key, cbResult, result[key], fields, result);
			}
		}

		if (next < keys.length - 1) {
			result.error = {error: true, message: `unknown parameters ${this.params.slice(next).join(', ')}`}
		}

		return result;
	}

}
