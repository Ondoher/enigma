/**
 * This is the class for an entry disc. Entry discs are fixed disks of connector
 * pins.
 */
export default class EntryDisc extends Encoder {
    /**
     * Constructor for the entry disc.
     *
     * @param {String} name the name of this entry disc
     * @param {EncoderSetup} settings contains the alphabet being used, and the map
     * 	between input and output contacts
     */
    constructor(name: string, settings: EncoderSetup);
    rightMap: number[];
    leftMap: number[];
}
import Encoder from './Encoder.js';
