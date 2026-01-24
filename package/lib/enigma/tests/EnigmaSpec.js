
import '../standardInventory.js';
import Enigma from "../Enigma.js";

import { enigmaData } from './EnigmaData.js';

describe('Enigma Test Cases', function() {
	/** @type {Enigma} */
	var enigma;

	function messageLoop(messages, which, cb) {
		return messages.find(function(message) {
			var enigma = new Enigma("Test", {
				reflector: message.setup.reflector
			});

			enigma.configure({
				plugs: message.setup.plugs,
				rotors: message.setup.rotors,
				ringSettings: message.setup.ringSettings
			})

			var toEncode = message.message[which]
			var encoded = enigma.translate(message.message.key,toEncode);

			return cb(message, encoded);
		})
	}

	describe('Stepping', function() {
		var steps = {}
		beforeEach(function() {
			enigma = new Enigma("I", {
				reflector: 'B',
			});

			enigma.configure({rotors: ['I', 'II', 'III']});

			listen()
		});

		function listen() {
			enigma.listen('test', (event, name, data) => {
				if (event === 'step') {
					steps[name] = steps[name] || [];
					steps[name].push(data);
				}
			})
		}

		it ('should step only the right-most rotor when not at turnover', function() {
			steps = {};
			enigma.translate('AAA', 'A');
			var stepped = Object.keys(steps);
			expect(stepped.length).toBe(1);
			expect(stepped[0]).toBe('III');
		});

		it ('should step the next rotor when the previous turns over', function() {
			steps = {};
			enigma.translate('AAV', 'A');
			expect(steps['II'].length).toBe(1);
		});

		it ('should double step when reaching the turn over', function() {
			steps = {};
			enigma.translate('ADV', 'AA');
			expect(steps['II'].length).toBe(2);
		});

		it ('should double step on first step', function() {
			steps = {};

			enigma.configure({rotors: ['III', 'VI', 'VIII'], ringSettings: [1, 8, 13]});

			listen();

			enigma.translate('UZV', 'AA');
			expect(steps['VI'].length).toBe(1);
		});
	})

	describe('Encoding', function() {
		it('Should encode sample field messages', function() {
			var messages = enigmaData.sampleFieldMessages;

			var fail = messageLoop(messages, 'decoded', function(message, decoded) {
				return decoded !== message.message.encoded;
			})

			expect(fail).toBeUndefined();
		});

		it('Should decode sample field messages', function() {
			var messages = enigmaData.sampleFieldMessages;

			var fail = messageLoop(messages, 'encoded', function(message, decoded) {
				return decoded !== message.message.decoded;
			})

			expect(fail).toBeUndefined();
		})

		it('Should encode sample verified messages', function() {
			var messages = enigmaData.sampleVerifiedMessages;

			var fail = messageLoop(messages, 'decoded', function(message, decoded) {
				return decoded !== message.message.encoded;
			})

			expect(fail).toBeUndefined();
		});

		it('Should decode sample verified messages', function() {
			var messages = enigmaData.sampleVerifiedMessages;

			var fail = messageLoop(messages, 'encoded', function(message, decoded) {
				return decoded !== message.message.decoded;
			})

			expect(fail).toBeUndefined();
		})

	})
})
