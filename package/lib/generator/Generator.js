
import Enigma from '../enigma/Enigma.js';
import '../enigma/standardInventory.js';
import sentences from './hamlet.js'
import inventory from '../enigma/Inventory.js';
import { STANDARD_ALPHABET } from '../enigma/consts.js';


/**
 * @typedef {Object} EnigmaConfiguration specifies a configuration for the
 * 	Enigma model M3. This assumes an Enigma with standard reflector B
 * @property {Array.<String>} rotors an array of three rotor names
 * @property {Array.<Number>} ringSettings an array of offsets for the ring
 * 	settings
 * @property {Array.<Array>} plugs 10 pairs of letters that will be used as
 * 	connections on the plug board
 */

export default class Generator {
	constructor(embellish) {
		this.embellish = embellish;
		this.enigma = new Enigma({reflector: 'B'});
		this.indicators = {};
	}

	/**
	 * call this method to pick a random number from an array and remove it
	 * @param {Array} list the array of itens to chooise from
	 *
	 * @returns {*} the chosen item
	 */
	pickOne(list) {
		var pos = Math.floor(Math.random() * list.length);
		var choice = list.splice(pos, 1);
		return choice[0];
	}

	/**
	 * Call this method to pick two items from a given list. The items are
	 * removed from the array
	 *
	 * @param {Array} list the array of items to choose
	 * @returns {Array} the two chosen items
	 */
	pickPair(list) {
		var result = [];
		result.push(this.pickOne(list))
		result.push(this.pickOne(list))

		return result;
	}

	/**
	 * Call this method to chose a random item from a list. The item is not
	 * removed.
	 *
	 * @param {Array} list the list of items to choose from
	 *
	 * @returns {*} the chosen item
	 */
	chooseOne(list) {
		var pos = Math.floor(Math.random() * list.length);
		return list[pos];
	}

	/**
	 * Call this method to choose a given number of items from a list. The items
	 * are removed.
	 *
	 * @param {Number} count te number of items to pick
	 * @param {*} list the list of items to choose from
	 *
	 * @returns {Array} the chosen items
	 */
	pick(count, list) {

		var result = [];
		for(var idx = 0; idx < count; idx++) {
			result.push(this.pickOne(list));
		}

		return result;
	}

	/**
	 * Call this method to randomly pick a number of items from a list. The
	 * items are not removed.
	 *
	 * @param {Number} count the number of items to choose
	 * @param {Array} list the list of items to choose from
	 *
	 * @returns {Array} the list of items chosen
	 */
	choose(count, list){
		var result = [];
		for(var idx = 0; idx < count; idx++) {
			result.push(this.chooseOne(list));
		}

		return result;
	}

	/**
	 * Call this method to randmply pick a given number of item pairs. The items
	 * will be removed from the list.
	 *
	 * @param {Number} count the number of pairs to pick
	 * @param {Array} list the list of items to choose from
	 *
	 * @returns {Array.<Array>} the item pairs chosen. Each pair is an array of
	 * 	two items from the list
	 */
	pickPairs(count, list) {
		var result = [];

		for(var idx = 0; idx < count; idx++) {
			result.push(this.pickPair(list));
		}

		return result;
	}

	/**
	 * Call this method to pick pairs of strings from an array of strings. This
	 * returns an array of strings where each chosen pair has been concatenated.
	 * The strings are removed from the list.
	 *
	 * @param {Number} the number of pairs to pick
	 * @param {Array.<String>} list the strings to pick from
	 * @returns {Array.<String>} the array of string pairs
	 */
	pickStringPairs(count, list) {
		var result = [];

		for(var idx = 0; idx < count; idx++) {
			result.push(this.pickPair(list).join(''));
		}

		return result;

	}

	/**
	 * Call this method to generate the given number of sentences. The sentences
	 * are pulled from the text of Hamlet.
	 *
	 * @param {Number} count the number of sentences
	 * @returns {String} the sentences separated by a ' ';
	 */
	generateSentences(count) {
		var start = Math.floor(Math.random() * sentences.length) + count;

		return sentences.slice(start, start + count).join(' ');
	}

	/**
	 * Call this method to create a three letter string as an identifier for a
	 * a day in a key sheet
	 *
	 * @returns {String} the string
	 */
	makeIndicator() {
		var letters = [...'abcdefghijklmnopqrstuvwxyzx'];
		var indicator;

		do {
			indicator = this.choose(3, letters).join('');
		} while (this.indicators[indicator]);

		this.indicators[indicator] = indicator;

		return indicator;
	}

	/**
	 * Call this method to generate a random Enigma setup
	 *
	 * @param {Object} [settings] options for settings
	 * @property {Array.<String>} [rotors] alternate list of rotors to choose
	 * 	from
	 * @property {Array.<String>} [fixed] an array of fixed rotors to pick one
	 * 	of
	 *
	 * @returns {Object} the Enigma settings.
	 * @property {Array.<String>} rotors an array of three rotor names, four if
	 * 	fixed was given
	 * @property {Array.<Number>} ringSettings an array of offsets for the ring
	 * 	settings
	 * @property {Array.<Array>} plugs 10 pairs of letters that will be used as
	 * 	connections on the plug board
	 */
	generateEnigmaSetup(settings = {}) {
		var rotorInventory = settings.rotors || inventory.getRotorNames();
		var connectors = [...Array(26).keys()];
		var letters = [...STANDARD_ALPHABET];

		var rotors = this.pick(3, rotorInventory);
		var ringSettings = this.choose(3, connectors);
		var plugsA = this.pickStringPairs(10, letters);
		ringSettings[0]++;
		ringSettings[1]++;
		ringSettings[2]++;

		var plugs = plugsA.join(' ');

		if (settings.fixed) {
			rotors.unshift(this.pickOne(settings.fixed));
			ringSettings.push(this.chooseOne(connectors));
			ringSettings[3]++;
		}

		return {rotors, plugs, ringSettings};
	}

	/**
	 * Call this method to create a single days configuration for a key sheet.
	 * This an Enigma configuration plus the other metadata.
	 *
	 * @param {idx} idx the day of the month
	 *
	 * @returns {Object} the single day of the key sheet
	 * @property {Number} day the day of the month
	 * @property {Array.<String>} rotors an array of three rotor names
	 * @property {Array.<Number>} ringSettings an array of offsets for the ring
	 * 	settings
	 * @property {Array.<String>} plugs 10 pairs of letters that will be used as
	 * 	connections on the plug board
	 * @propery {Array.<String>} indicators and array of four three letter
	 * 	strings. This will be unique across a key sheet
	 */
	generateDay(idx) {
		var settings = this.generateEnigmaSetup();

		var indicators = [];

		indicators.push(this.makeIndicator());
		indicators.push(this.makeIndicator());
		indicators.push(this.makeIndicator());
		indicators.push(this.makeIndicator());

		return {...settings, indicators}
	}

	/**
	 * Call this method to construct a key sheet for the given number of days
	 *
	 * @param {Number} days the number of days on the key sheet
	 * @returns {Array.<Object>} the array of day objects
	 */
	generateKeySheet(days) {
		var sheet = [];
		this.indicators = {};

		for(var idx = 0; idx < days; idx++) {
			sheet.push(this.generateDay(idx))
		}

		return sheet;
	}

	/**
	 * Call this method to break a string into groups of five letters with a
	 * space between them.
	 *
	 * @param {String} text the original text
	 * @returns {String} the segmented string
	 */
	segment(text) {
		var textArray = [...text];
		var text = textArray.reduce(function(text, letter, idx) {
			text = text + letter;
			if (Math.floor(idx % 5) === 4) text = text + ' ';
			return text;
		}, '');

		return text
	}

	/**
	 * Call this method to turn a string into valid characters for encyption,
	 * which is just the letters A-Z. If the generator was created with the
	 * embellish option then certain characters in the original text will be
	 * relaced by uncommon letter triplets. This allows for better presentation
	 * when the message as been decoded
	 *
	 * @param {String} text the original text
	 * @returns {String} the text that has been normalized to what the Enigma
	 * 	can process
	 */
	cleanMessage(text) {
		text = text.toUpperCase();

		if (this.embellish) {
			text = text.replace(/,/g, 'ZIZ');
			text = text.replace(/\./g, 'YIY');
			text = text.replace(/\?/g, 'XIX');
			text = text.replace(/ +/g, 'WIW');
			text = text.replace(/'/g, 'VIV');
			text = text.replace(/'/g, 'UIU');
			text = text.replace(/0/g, 'NULL');
			text = text.replace(/1/g, 'ONE');
			text = text.replace(/2/g, 'TWO');
			text = text.replace(/3/g, 'THREE');
			text = text.replace(/4/g, 'FOUR');
			text = text.replace(/5/g, 'FIVE');
			text = text.replace(/6/g, 'SIX');
			text = text.replace(/7/g, 'SEVEN');
			text = text.replace(/8/g, 'EIGHT');
			text = text.replace(/9/g, 'NINE');
		}
		text = text.replace(/[^A-Z]/g, '');

		return this.segment(text);
	}

	/**
	 * Call this method to process one submessage from a longer message. This is
	 * part of code to generate a message as the Enigma would have been used.
	 *
	 * @param {string} indicator the three letter code that can be sent to
	 * 	reference the configuration of the Enigma. These will be used to cross
	 * reference the message to the machine configuration on the key sheet
	 * @param {String} text the cleaned up string to be encoded
	 *
	 * @returns {Object} the generated message part
	 * @property {String} key a randomly chosen key, this would be transmitted
	 * 	with the message
	 * @property {String} enc the encoded start position for the message. This
	 * 	was encoded using the randomly chosen key. This was sent with the
	 * 	message
	 * @property {String} text the message text encoded using the unencoded
	 * 	start position. The first five letters of this text string included the
	 * 	unencrypted key identifier.
	 * @property {String} start the the unencoded start position. This was not
	 * 	sent with the message but s included here to verify an implementation of
	 * 	this method.
	 * @property {String} clear the message before being encoded. Given to
	 * 	verify the value if data is being used to test the Enigma system
	 * 	implementation
	 */
	encodeOnePart(indicator, text) {
		var key = this.choose(3, STANDARD_ALPHABET).join('');
		var start = this.choose(3, STANDARD_ALPHABET).join('');
		var enc = this.enigma.encode(key, start);
		var clear = text;

		text = text.replace(/ /g, '');
		text = this.enigma.encode(start, text);
		text = this.segment(text);
		text = indicator + ' ' + text

		return {key, enc, start, text, clear};
	}

	/**
	 * Call this method to generate a full message based on the data in a key
	 * sheet. The message constructed reflects an actual message as the Enigma
	 * was really used. An individual message cannot be more than 250
	 * characters, so longer messages are broken into multiple parts. each one
	 * encoded with a unique key
	 *
	 * @param {Object} sheet a key sheet generated using the generateKeySheet
	 * 	method
	 * @returns {Array} a list of encoded sub messages
	 */
	generateMessage(sheet) {
		var dayIdx = Math.floor(Math.random() * 30);
		var day = sheet[dayIdx]
		var indicator = this.chooseOne(day.indicators);
		var count = Math.floor(Math.random() * 4) + 1;

		this.enigma.configure({plugs: day.plugs, rotors: day.rotors, ringSettings: day.ringSettings})
		var text = this.cleanMessage(this.generateSentences(count));

		var indicator = this.chooseOne(day.indicators);
		indicator = (this.choose(2, [...STANDARD_ALPHABET]).join('') + indicator).toUpperCase();

		var messageParts = [];
		while (text.length) {
			var segment = text.slice(0, 245);
			if (text.length)
				text = text.slice(246);

			messageParts.push(segment);
		}

		var messages = messageParts.map(function(part) {
			return this.encodeOnePart(indicator, part)
		}, this);

		return messages;
	}

	/**
	 * Call this method to generate a given number of messages based on a
	 * generated key sheet
	 *
	 * @param {Object} sheet the generated key sheet
	 * @param {Number} count the number of messages to generate
	 *
	 * @returns {Array} the list of generated messages
	 */
	generateMessages(sheet, count) {
		var result = [];
		for (var idx = 0; idx < count; idx++) {
			result.push(this.generateMessage(sheet));
		}

		return result;
	}

	/**
	 *  Call this method to generate some random text encoded with a random
	 * Enigma configuration. The random text will be a few sentences from
	 * Hamlet.
	 *
	 * @param {Object} settings alternate details to define the Enigma
	 * 	configuration
	 * @property {Array.<String>} [rotors] alternate list of rotors to choose
	 * 	from
	 * @property {Array.<String>} [fixed] an array of fixed rotors to pick from
	 * @property {Array.<String>} [reflectors] an array of reflectors to choose
	 * 	from
	 *
	 * @returns {Object} Details of the generated text
	 * @property {EnigmaConfiguration} setup how the Enigma  was configured to
	 * 	encode the message
	 * @property {String} start three letter string with the starting rotor
	 * 	offsets used to encode the string.
	 * @property {String} message the encoded text
	 * @property {String} clear the unencoded text
	 */
	generateEncodedText(settings) {
		var reflectors = settings.reflectors || ['A', 'B', 'C'];
		var reflector = this.pickOne(reflectors);
		var enigma = new Enigma({reflector: reflector});
		var setup = this.generateEnigmaSetup(settings);
		var count = Math.floor(Math.random() * 3) + 2;

		setup.reflector = reflector;

		var text = this.cleanMessage(this.generateSentences(count));
		var start = this.choose(settings.fixed ? 4 : 3, STANDARD_ALPHABET).join('');

		enigma.configure(setup);

		text = text.replace(/ /g, '');
		var encoded = enigma.encode(start, text);

		return {setup, message: { key: start, encoded, decoded: text}};
	}
}
