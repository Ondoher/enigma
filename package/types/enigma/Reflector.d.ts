/**
 * Make in instance of this class to construct a reflector
 */
export default class Reflector extends Encoder {
    /**
     * constructor for the reflector class.
     *
     * @param {String} name - the name of the reflector instance
     * @param {EncoderSetup} settings - The definition of the reflector
     */
    constructor(name: string, settings: EncoderSetup);
    map: number[];
}
import Encoder from './Encoder.js';
