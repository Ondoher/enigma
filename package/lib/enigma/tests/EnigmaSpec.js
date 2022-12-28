
import '../standardInventory.js';
import Enigma from "../Enigma.js";

import { enigmaData } from './EnigmaData.js';

describe('Enigma Test Cases', function() {
	var enigma;
/*
	describe('Configuration', function() {

	})
*/

	function messageLoop(messages, which, cb) {
		return messages.find(function(message) {
			var enigma = new Enigma({
				reflector: message.setup.reflector
			});

			enigma.configure({
				plugs: message.setup.plugs,
				rotors: message.setup.rotors,
				ringSettings: message.setup.ringSettings
			})

			var toEncode = message.message[which]
			var encoded = enigma.encode(message.message.key,toEncode);

			return cb(message, encoded);
		})
	}

	describe('Stepping', function() {
		var steps = {}
		beforeEach(function() {
			enigma = new Enigma({
				reflector: 'B',
			});

			enigma.configure({rotors: ['I', 'II', 'III']});

			enigma.listen(function(event, name, message, info) {
				if (event === 'step') {
					steps[name] = steps[name] || [];
					steps[name].push(info);
				}
			})

		});

		it ('should step only the right-most rotor when not at turnover', function() {
			steps = {};
			enigma.encode('AAA', 'A');
			var stepped = Object.keys(steps);
			expect(stepped.length).toBe(1);
			expect(stepped[0]).toBe('rotor-III');
		});

		it ('should step the next rotor when the previous turns over', function() {
			steps = {};
			enigma.encode('AAV', 'A');
			expect(steps['rotor-II'].length).toBe(1);
		});

		it ('should double step when reaching the turn over', function() {
			steps = {};
			enigma.encode('ADV', 'AA');
			expect(steps['rotor-II'].length).toBe(2);
		});

		it ('should double step on first step', function() {
			steps = {};

			enigma.configure({rotors: ['III', 'VI', 'VIII'], ringSettings: [1, 8, 13]});

			enigma.encode('UZV', 'AA');
			expect(steps['rotor-VI'].length).toBe(1);
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
