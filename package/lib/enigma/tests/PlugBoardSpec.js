import PlugBoard from "../PlugBoard.js";
import { plugBoardData } from './PlugBoardData.js';

describe('PlugBoard Test Cases', function() {
    var plugBoard;

    describe('Encode', function() {
        beforeEach(function() {
            plugBoard = new PlugBoard('test-plugboard', {
                alphabet: plugBoardData.alphabet,
            });
        })

        it('passes through if no plugs defined', function() {
            plugBoard.configure()
            var alphabet = [...plugBoardData.alphabet];
            alphabet.forEach(function(letter) {
                var input = plugBoardData.alphabet.indexOf(letter);
                var output = plugBoard.encode('right', input);
                expect(output).toBe(input);
                var output = plugBoard.encode('left', input);
                expect(output).toBe(input);
            })
        });

        it('should link cabled pairs', function() {
            plugBoard.configure({plugs: plugBoardData.plugSettings});
            var pairs = plugBoardData.plugSettings.split(' ');
            var alphabet = plugBoardData.alphabet;
            pairs.forEach(function(pair) {
                var left = alphabet.indexOf(pair[0]);
                var right = alphabet.indexOf(pair[1]);

                var output = plugBoard.encode('right', left);
                expect(output).toBe(right);
                var output = plugBoard.encode('right', right);
                expect(output).toBe(left);

                var output = plugBoard.encode('left', right);
                expect(output).toBe(left);
                var output = plugBoard.encode('left', left);
                expect(output).toBe(right);
            })
        })
    })
})
