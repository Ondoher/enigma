
import Enigma from '../enigma/Enigma.js';
import '../enigma/standardInventory.js';
import sentences from './hamlet.js'
import { STANDARD_ALPHABET } from '../enigma/consts.js';
import Random from '../utils/Random.js';
import Generator from './Generator.js';

/**
 * Use this class to generate Enigma key sheets and messages using it. The
 * procedures used were derived from the information at
 * [Enigma Message Procedures](https://www.ciphermachinesandcryptology.com/en/enigmaproc.htm)
 */
export default class CodeBook {
	/**
	 * Constructor for the `CodeBook` class.
	 * @param {Enigma} enigma - all encryption will be done using this configured Enigma
	 */
	constructor(enigma) {
		this.enigma = enigma
		this.indicators = {};
		this.generator = new Generator();
	}

	/**
	 * Call this method to provide a new configuration to the enigma
	 *
	 * @param {SimplifiedConfiguration} config
	 */
	configure(config) {
		this.enigma.configure(config);
	}

	reset() {
		this.indicators = {}
	}

	/**
	 * Call this method to create a three letter string as an identifier for a
	 * a day in a key sheet
	 *
	 * @returns {String} the string
	 */
	makeIndicator() {
		let letters = [...'abcdefghijklmnopqrstuvwxyzx'];
		let indicator;

		do {
			indicator = Random.choose(3, letters).join('');
		} while (this.indicators[indicator]);

		this.indicators[indicator] = indicator;

		return indicator;
	}

	/**
	 * Call this method to create a single days configuration for a key sheet.
	 * This an Enigma configuration plus the other metadata.
	 *
	 * @param {number} day the day of the month
	 *
	 * @returns {KeySheetLine} One line of a key sheet
	 */
	generateDay(day) {
		let settings = this.generator.generateEnigmaConfiguration();
		let indicators = [];

		indicators.push(this.makeIndicator());
		indicators.push(this.makeIndicator());
		indicators.push(this.makeIndicator());
		indicators.push(this.makeIndicator());

		return {day, ...settings, indicators}
	}

	/**
	 * Call this method to construct a key sheet for the given number of days
	 *
	 * @param {Number} days the number of days on the key sheet
	 * @returns {KeySheetLine[]} the array of day objects
	 */
	generateKeySheet(days) {
		let sheet = [];
		this.indicators = {};

		for(let idx = 0; idx < days; idx++) {
			sheet.push(this.generateDay(idx))
		}

		return sheet;
	}

	/**
	 * Call this method to process one sub-message from a longer message. This is
	 * part of code to generate a message as the Enigma would have been used.
	 *
	 * @param {string[]} indicators the three letter code that can be sent to
	 * 	reference the configuration of the Enigma. These will be used to cross
	 * reference the message to the machine configuration on the key sheet
	 * @param {String} text the cleaned up string to be encoded
	 *
	 * @returns {MessagePart} the encoded message segment
	 */
	encodeOnePart(indicators, text) {
		let indicator = Random.chooseOne(indicators);
		let paddedIndicator = (Random.choose(2, [...STANDARD_ALPHABET]).join('') + indicator).toUpperCase();

		let key = Random.choose(3, [...STANDARD_ALPHABET]).join('');
		let start = Random.choose(3, [...STANDARD_ALPHABET]).join('');
		let enc = this.enigma.encode(key, start);
		let clear = text;

		text = text.replace(/ /g, '');
		text = this.enigma.encode(start, text);
		text = this.generator.groupText(text);
		text = paddedIndicator + ' ' + text

		return {key, enc, start, text, clear};
	}

	/**
	 * Call this method to generate a full message based on the data in a key
	 * sheet. The message constructed reflects an actual message as the Enigma
	 * was really used. An individual message cannot be more than 250
	 * characters, so longer messages are broken into multiple parts, each one
	 * encoded with a unique key
	 *
	 * @param {KeySheetLine[]} sheet a key sheet generated using generateKeySheet
	 * @param {number} [dayIdx] - if provided, specifies the day of the month for the message
	 * @param {string} [text] - if provided, this is the text of the message to generate
	 * @returns {KeyBookMessage} a list of encoded sub messages
	 */
	generateMessage(sheet, dayIdx, text) {
		dayIdx = dayIdx === undefined ? Random.random(sheet.length) : dayIdx;
		let day = sheet[dayIdx]
		let count = Random.random(3) + 2;

		this.enigma.configure({plugs: day.plugs, rotors: day.rotors, ringSettings: day.ringSettings})

		text = text ?? this.generator.generateSentences(count);
		text = this.generator.cleanMessage(text);
		let messageParts = [];

		while (text.length) {
			let segment = text.slice(0, 245);
			if (text.length)
				text = text.slice(246);

			messageParts.push(segment);
		}

		let messages = messageParts.map((part) => {
			return this.encodeOnePart(day.indicators, part)
		});

		return {
			options: this.enigma.configuration,
			parts: messages
		}
	}

	/**
	 * Call this method to generate a given number of messages based on a
	 * generated key sheet
	 *
	 * @param {Object} sheet  the generated key sheet
	 * @param {Number} count - the number of messages to generate
	 *
	 * @returns {Array} the list of generated messages
	 */
	generateMessages(sheet, count) {
		let result = [];
		for (let idx = 0; idx < count; idx++) {
			result.push(this.generateMessage(sheet));
		}

		return result;
	}
}
