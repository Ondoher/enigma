import Rotor from "../Rotor.js";
import { rotorData } from './RotorData.js';

describe('Rotor Test Cases', function() {
	let rotor;

	describe('Constructor', function() {
		it('creates the reverse map table', function() {
			rotor = new Rotor('test-rotor', {
				alphabet: rotorData.createData.alphabet,
				map: rotorData.createData.map,
			});

			expect(rotor.leftMap).toEqual(rotorData.createData.reverseMap)
		});

		it('sets the length to the map length', function() {
			rotor = new Rotor('test-rotor', {
				alphabet: rotorData.createData.alphabet,
				map: rotorData.createData.map,
			});

			expect(rotor.length).toEqual(rotorData.createData.map.length)
		});

		it('remembers multiple turnovers', function() {
			rotor = new Rotor('test-rotor', {
				map: rotorData.createData.map,
				turnovers: rotorData.createData.turnovers,
			});

			let turnovers = [...rotor._turnovers];

			expect(turnovers).toEqual(rotorData.createData.turnoversMap);
		})
	})

	describe('Rotation', function() {
		beforeEach(function() {
			rotor = new Rotor('test-rotor', {
				map: rotorData.I.map,
				turnovers: rotorData.I.turnovers
			});
		});

		describe('startPosition', function() {
			it('no Rotation', function() {
				rotor.setStartPosition('A');
				expect(rotor.offset).toBe(0)
			})

			it('one step', function() {
				rotor.setStartPosition('B');
				expect(rotor.offset).toBe(1)
			})

			it('length steps', function() {
				rotor.setStartPosition('Z');
				expect(rotor.offset).toBe(25)
			})
		});

		describe('ring setting', function() {
			it ('one', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('B');
				expect(rotor.offset).toBe(0)
			})

			it ('wrap', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('Z');
				expect(rotor.offset).toBe(24);
			});
		});

		describe('step', function() {
			it ('adjusts offset', function() {
				rotor.step();
				expect(rotor.offset).toBe(1);
			});

			it('wraps', function() {
				rotor.setStartPosition('Z');
				rotor.step();
				expect(rotor.offset).toBe(0);
			});

			it('handles double step', function() {
				rotor.setStartPosition('Q');
				let result = rotor.willTurnover();
				expect(result).toBe(true);
			});

			it('handles turnover', function() {
				rotor.setStartPosition('Q');
				let result = rotor.step();
				expect(result).toBe(true);
			});
		});

		describe('ringSettings', function() {
			it('adjusts offset', function() {
				rotor.ringOffset = 10;
				rotor.setStartPosition('P');
				expect(rotor.offset).toBe(5)
			});

			it('wraps', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('P');
				expect(rotor.offset).toBe(14)
			});

			it('handles double step', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('Q');
				let result = rotor.willTurnover();
				expect(result).toBe(true);
			});

			it('handles turnover', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('Q');
				let result = rotor.step();
				expect(result).toBe(true);
			});
		});
	})

	describe('Encoding', function() {
		beforeEach(function() {
			rotor = new Rotor('test-rotor', {
				map: rotorData.I.map,
				turnovers: rotorData.I.turnovers
			});
		});

		describe('encode to the right', function() {
			it('rotation 0', function() {
				let result = rotor.encode('right', 0);
				expect(result).toBe(4);
			});

			it('25 steps', function() {
				rotor.offset = 24;
				let result = rotor.encode('right', 0);
				expect(result).toBe(4);
			});

			it('1 step', function() {
				rotor.step();
				let result = rotor.encode('right', 0)
				expect(result).toBe(9);
			})

			it('ring setting 1, rotation 0', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('A');
				let result = rotor.encode('right', 0)
				expect(result).toBe(10);
			});

			it('ring setting 1, 1 step', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('B');
				let result = rotor.encode('right', 0)
				expect(result).toBe(4);
			});

			it('ring setting 1, 25 steps', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('Y');
				let result = rotor.encode('right', 0)
				expect(result).toBe(20);
			});

			it('ring setting 25, rotation 0', function() {
				rotor.ringOffset = 25;
				rotor.setStartPosition('A');
				let result = rotor.encode('right', 0)
				expect(result).toBe(9);
			});

			it('ring setting 25, 1 step', function() {
				rotor.ringOffset = 25;
				rotor.setStartPosition('B');
				let result = rotor.encode('right', 0)
				expect(result).toBe(10);
			});

			it('ring setting 25, 25 steps', function() {
				rotor.ringOffset = 25;
				rotor.setStartPosition('Y');
				let result = rotor.encode('right', 0)
				expect(result).toBe(10);
			});
		})
		describe('encode to the left', function() {
			it('rotation 0', function() {
				let result = rotor.encode('left', 0);
				expect(result).toBe(20);
			});

			it('25 steps', function() {
				rotor.offset = 24;
				let result = rotor.encode('left', 0);
				expect(result).toBe(16);
			});

			it('1 step', function() {
				rotor.step();
				let result = rotor.encode('left', 0)
				expect(result).toBe(21);
			})

			it('ring setting 1, rotation 0', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('A');
				let result = rotor.encode('left', 0)
				expect(result).toBe(10);
			});

			it('ring setting 1, 1 step', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('B');
				let result = rotor.encode('left', 0)
				expect(result).toBe(20);
			});

			it('ring setting 1, 25 steps', function() {
				rotor.ringOffset = 1;
				rotor.setStartPosition('Y');
				let result = rotor.encode('left', 0)
				expect(result).toBe(19);
			});

			it('ring setting 25, rotation 0', function() {
				rotor.ringOffset = 25;
				rotor.setStartPosition('A');
				let result = rotor.encode('left', 0)
				expect(result).toBe(21);
			});

			it('ring setting 25, 1 step', function() {
				rotor.ringOffset = 25;
				rotor.setStartPosition('B');
				let result = rotor.encode('left', 0)
				expect(result).toBe(22);
			});

			it('ring setting 25, 25 steps', function() {
				rotor.ringOffset = 25;
				rotor.setStartPosition('Y');
				let result = rotor.encode('left', 0)
				expect(result).toBe(10);
			});
		})

	})
});

//                     1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2
// 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
// A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
