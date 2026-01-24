/**
 * Construct this class to get a new instance of the Enigma. Many of the
 * parameters to the constructor and the config method reference the names of
 * standard Enigma parts. These are retrieved from the Inventory instance
 */
export default class Enigma extends Encoder {
    /**
     * The constructor for the Enigma. This represents the unconfigurable
     * settings of the device.
     *
     * @param {string} name - the name of the enigma
     * @param {EnigmaSetup} settings - the setup options
     */
    constructor(name: string, settings: EnigmaSetup);
    plugboard: PlugBoard;
    entryDisc: EntryDisc;
    reflector: Reflector;
    length: number;
    /** @type {Rotor[]} */
    _rotors: Rotor[];
    /** @type {{[rotor: number]: boolean}} */
    pending: {
        [rotor: number]: boolean;
    };
    /** @type {Encoder[]} */
    encoders: Encoder[];
    /**@type {SimplifiedConfiguration & {reflector: string}} */
    _configuration: SimplifiedConfiguration & {
        reflector: string;
    };
    /**
     * the configured rotors
     *
     * @public
     *
     * @return {Rotor[]}
     */
    public get rotors(): Rotor[];
    /**
     * The configuration and setup options
     *
     * @public
     *
     * @returns {SimplifiedConfiguration & {reflector: string}}
     */
    public get configuration(): SimplifiedConfiguration & {
        reflector: string;
    };
    /**
     * Configure the Enigma for encoding.
     *
     * @public
     *
     * @param {EnigmaConfiguration} settings - the configuration of the Enigma.
     * These settings represent the aspects of the Enigma that can can change for daily
     * configuration.
     */
    public configure(settings: EnigmaConfiguration): void;
    /**
     * Call this method to "step" the rotors one time. This method will manage the
     * stepping between all rotors
     *
     * @public
     */
    public step(): void;
    /**
     * Call this method to set the starting rotation for the messages to encrypt
     *
     * @public
     *
     * @param {number[]|string} setup - length of the string or the array
     * 	should match the number of rotors and are given left to right. If start
     * 	is a string then the letters of the string specify the start value seen
     * 	in the window for the corresponding rotor. If it is an array then each
     * 	number will be the one-based rotation.
     */
    public setStart(setup: number[] | string): void;
    /**
     * Call this method to simulate a keypress on the Enigma. This will output
     * the encoded letter
     *
     * @public
     *
     * @param {String} letter - the key pressed
     * @returns {String | undefined} the encoded letter
     */
    public keyPress(letter: string): string | undefined;
    /**
     * Call this shortcut method to encode a whole string
     *
     * @public
     *
     * @param {String} start - the starting position for the rotors
     * @param {String} text - the text to encode
     *
     * @returns {String} the encoded string.
     */
    public translate(start: string, text: string): string;
}
import Encoder from "./Encoder.js";
import PlugBoard from "./PlugBoard.js";
import EntryDisc from "./EntryDisc.js";
import Reflector from "./Reflector.js";
import Rotor from "./Rotor.js";
