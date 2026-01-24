/**
 * This is the base class for an encoder. The default implementation of the
 * encode method is to return the input as the output
 */
export default class Encoder {
    /**
     * Constructor for the base encoder
     *
     * @param {string} name
     * @param {ComponentType} type
     * @param {EncoderSetup} settings
     */
    constructor(name: string, type: ComponentType, settings: EncoderSetup);
    name: string;
    type: ComponentType;
    alphabet: string;
    contactCount: number;
    /** @type {{[name: string]: Listener}} */
    listeners: {
        [name: string]: Listener;
    };
    /**
     * given a connector number, normalize it to be between 0 and 25 inclusive.
     *
     * @param {Number} connector the connector being normalized
     *
     * @returns {Number} value between 0 and 25
     */
    normalize(connector: number): number;
    /**
     *
     * @param {string} letter
     *
     * @returns {boolean}
     */
    verifyLetter(letter: string): boolean;
    /**
     * Call this method to convert a letter to a connector value
     *
     * @param {string} letter
     * @returns {number | undefined}
     */
    letterToConnector(letter: string): number | undefined;
    /**
     * Call this method to turn a connector to a letter value
     *
     * @param {number} connector
     * @returns {string | undefined}
     */
    connectorToLetter(connector: number): string | undefined;
    /**
     * Given an alphabetic connection map, convert that into an array of
     * numbers. The index into the array or string is the input connector, and
     * the value at that position is the output connector
     *
     * @param {String} map connections map.
     * @returns {Array.<Number>} the numerical map
     */
    makeMap(map: string): Array<number>;
    /**
     * given an existing connection map from input to out put, create a new map
     * that has the connections going in the other direction, output to input.
     *
     * @param {Array.<Number>} map connection map
     * @returns {Array.<Number>} the reversed map
     */
    makeReverseMap(map: Array<number>): Array<number>;
    /**
     * Call this method to convert the input connector number to the output in
     * the given direction The default encode method just passes the input value
     * through
     *
     * @param {Direction} _direction either right for moving towards the reflector
     * 	or left if moving back
     * @param {Number} input the specific connection receiving an input
     *
     * @returns {Number} The translated output connector number
     */
    encode(_direction: Direction, input: number): number;
    /**
     *
     * @param {number | string} input
     * @param {Direction} direction
     */
    fireInput(input: number | string, direction: Direction): void;
    /**
     *
     * @param {number | string} output
     * @param {Direction} direction
     */
    fireOutput(output: number | string, direction: Direction): void;
    /**
     *
     * @param {number | string} input
     * @param {number | string} output
     * @param {Direction} direction
     */
    fireTranslate(input: number | string, output: number | string, direction: Direction): void;
    /**
     *
     * @param {number | string} input
     * @param {number | string} output
     * @param {Direction} direction
     */
    fireEncodeSet(input: number | string, output: number | string, direction: Direction): void;
    /**
     * Call this method to add a function to be called when important events
     * happen to a component. The name can be used to later remove the listener
     *
     * @param {string} name - the name of the listener
     * @param {Listener} cb - the function to be called.
     */
    listen(name: string, cb: Listener): void;
    /**
     * Call this method to remove a listener
     *
     * @param {string} name - the name of the listener
     */
    unlisten(name: string): void;
    /**
     * Call this method to call any event listeners
     *
     * @param {EventName} event - the event being fired
     * @param {String} name - the name of the component firing the event
     * @param {EventData} data - the event data
     */
    fire(event: EventName, name: string, data: EventData): void;
}
