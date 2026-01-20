import PlugBoard from "../PlugBoard.js";
import { plugBoardData } from './PlugBoardData.js';

describe('PlugBoard Test Cases', function() {
    /** @type {PlugBoard} */
    let plugBoard;

    describe('Encode', function() {
        beforeEach(function() {
            plugBoard = new PlugBoard('test-plugboard', {
                alphabet: plugBoardData.alphabet,
            });
        })

        it('passes through if no plugs defined', function() {
            plugBoard.configure()
            let alphabet = [...plugBoardData.alphabet];
            alphabet.forEach(function(letter) {
                let input = plugBoardData.alphabet.indexOf(letter);
                let output = plugBoard.encode('right', input);
                expect(output).toBe(input);
                output = plugBoard.encode('left', input);
                expect(output).toBe(input);
            })
        });

        it('should link cabled pairs', function() {
            plugBoard.configure(plugBoardData.plugSettings);
            let pairs = plugBoardData.plugSettings.split(' ');
            let alphabet = plugBoardData.alphabet;
            pairs.forEach(function(pair) {
                let left = alphabet.indexOf(pair[0]);
                let right = alphabet.indexOf(pair[1]);

                let output = plugBoard.encode('right', left);
                expect(output).toBe(right);
                output = plugBoard.encode('right', right);
                expect(output).toBe(left);

                output = plugBoard.encode('left', right);
                expect(output).toBe(left);
                output = plugBoard.encode('left', left);
                expect(output).toBe(right);
            })
        })
    })
})
