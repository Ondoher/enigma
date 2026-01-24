/**
 * This class represents the plugboard. There is only one type of plugboard
 */
export default class PlugBoard extends Encoder {
    /**
     * Constructor for the plugboard.
     *
     * @param {String} name - the name for the plugboard, defaults to 'plugboard'
     * @param {EncoderSetup} [settings] - the settings for the plugboard. Only needed if
     * 	using an alternate alphabet
     */
    constructor(name?: string, settings?: EncoderSetup);
    map: string;
    rightMap: any[];
    leftMap: any[];
    plugs: string;
    /**
     * Call this method to configure the plug board. This will be used to
     * provide the plug connections
     *
     * @public
     *
     * @param {Plugs} plugs - the configuration options for the plug board
     */
    public configure(plugs?: Plugs): void;
}
import Encoder from "./Encoder.js";
