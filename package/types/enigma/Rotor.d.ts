/**
 * Create an instance of this class to construct a Rotor object. The Rotor class
 * encapsulates many of the peculiar behaviors of the Enigma. All connector
 * values here are specified in physical space.
 */
export default class Rotor extends Encoder {
    /**
     * This is the constructor for the rotor.
     *
     * @param {String} name the name of the rotor; under normal circumstances
     * 	this will be the string 'rotor-' plus the standard name for the rotor,
        * for example 'rotor-IV'
     * @param {RotorSetup} settings an object that contains the various options that
     * define the the rotor and how it is configured.
     */
    constructor(name: string, settings: RotorSetup);
    map: string[];
    rightMap: number[];
    leftMap: number[];
    length: number;
    ringOffset: number;
    turnoverLookup: number[];
    offset: number;
    fixed: boolean;
    turnovers: string;
    _turnovers: Set<number>;
    /**
     * Call this method to select the initial rotation of the rotor. This is a
     * letter offset from the logical 0 connector. The initial rotation will
     * also take into account the ring setting
     *
     * @param {String} connector This is a letter value that corresponds to what
     * would appear in the rotation window. This value will be adjusted for the
     * ring setting.
     */
    setStartPosition(connector: string): void;
    /**
     * Call this method to step the rotor
     *
     * @returns {Boolean} true if the next rotor should be stepped
     */
    step(): boolean;
    /**
     * Call this method to see if the next step on this rotor will lead to
     * turnover. The Enigma class will call this on the middle rotor to handle
     * double stepping.
     *
     * @returns true if this rotor will turnover on the next step
     */
    willTurnover(): boolean;
    shouldTurnover(): boolean;
    /**
     * Call this method to find whether this is a fixed rotor. This is used for
     * the non stepping rotors--beta and gamma--that are used in the M4
     * @returns
     */
    isFixed(): boolean;
}
import Encoder from "./Encoder.js";
