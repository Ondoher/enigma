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
    constructor(enigma: Enigma);
    enigma: Enigma;
    indicators: {};
    generator: Generator;
    /**
     * Call this method to provide a new configuration to the enigma
     *
     * @public
     *
     * @param {SimplifiedConfiguration} config - how to configure the enigma
     */
    public configure(config: SimplifiedConfiguration): void;
    /**
     * @public
     *
     * reset the generator to its initial state
     */
    public reset(): void;
    /**
     * Call this method to create a three letter string as an identifier for a
     * a day in a key sheet
     *
     * @private
     *
     * @returns {String} the string
     */
    private makeIndicator;
    /**
     * Call this method to create a single days configuration for a key sheet.
     * This an Enigma configuration plus the other metadata.
     *
     * @private
     *
     * @param {number} day - the day of the month
     *
     * @returns {KeySheetLine} One line of a key sheet
     */
    private generateDay;
    /**
     * Call this method to construct a key sheet for the given number of days
     *
     * @public
     *
     * @param {Number} days - the number of days on the key sheet
     * @returns {KeySheetLine[]} the array of day objects
     */
    public generateKeySheet(days: number): KeySheetLine[];
    /**
     * Call this method to process one sub-message from a longer message. This is
     * part of code to generate a message as the Enigma would have been used.
     *
     * @private
     *
     * @param {string[]} indicators - the three letter code that can be sent to
     * 	reference the configuration of the Enigma. These will be used to cross
     * reference the message to the machine configuration on the key sheet
     * @param {String} text - the cleaned up string to be encoded
     *
     * @returns {MessagePart} the encoded message segment
     */
    private encodeOnePart;
    /**
     * Call this method to generate a full message based on the data in a key
     * sheet. The message constructed reflects an actual message as the Enigma
     * was really used. An individual message cannot be more than 250
     * characters, so longer messages are broken into multiple parts, each one
     * encoded with a unique key
     *
     * @public
     *
     * @param {KeySheetLine[]} sheet - a key sheet generated using generateKeySheet
     * @param {number} [dayIdx] - if provided, specifies the day of the month for the message
     * @param {string} [text] - if provided, this is the text of the message to generate
     * @returns {KeyBookMessage} a list of encoded sub messages
     */
    public generateMessage(sheet: KeySheetLine[], dayIdx?: number, text?: string): KeyBookMessage;
    /**
     * Call this method to generate a given number of messages based on a
     * generated key sheet
     *
     * @public
     *
     * @param {Object} sheet - the generated key sheet
     * @param {Number} count - the number of messages to generate
     *
     * @returns {Array} the list of generated messages
     */
    public generateMessages(sheet: any, count: number): any[];
}
import Enigma from '../enigma/Enigma.js';
import Generator from './Generator.js';
