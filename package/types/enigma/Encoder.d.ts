/**
 * This is the base class for an encoder. The default implementation of the
 * encode method is to return the input as the output
 */
export default class Encoder {
    /**
     * Constructor for the base encoder. This will the parent class for all
     * components
     *
     * @param {string} name - the name of the encoder
     * @param {ComponentType} type - the type of component
     * @param {EncoderSetup} settings - the base settings for the encoder
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
     * @protected
     *
     * @param {Number} connector - the connector being normalized
     * @returns {Number} value between 0 and 25
     */
    protected normalize(connector: number): number;
    /**
     * Call this method to check if the given character is a valid character in
     * the setup alphabet. Any unexpected character except for a space will
     * output warning to the console.
     *
     * @public
     *
     * @param {string} letter - the character to check
     * @returns {boolean} true if it is false otherwise
     */
    public verifyLetter(letter: string): boolean;
    /**
     * Call this method to convert a letter to a connector value.
     *
     * @public
     *
     * @param {string} letter - the character to convert. If it is not a valid
     * letter then this function will return undefined
     * @returns {number | undefined}
     */
    public letterToConnector(letter: string): number | undefined;
    /**
     * Call this method to turn a connector to a letter value
     *
     * @public
     *
     * @param {number} connector - connector number to convert
     * @returns {string | undefined}
     */
    public connectorToLetter(connector: number): string | undefined;
    /**
     * Given an alphabetic connection map, convert that into an array of
     * numbers. The index into the array or string is the input connector, and
     * the value at that position is the output connector
     *
     * @protected
     *
     * @param {String} map - connections map.
     * @returns {Array.<Number>} the numerical map
     */
    protected makeMap(map: string): Array<number>;
    /**
     * given an existing connection map from input to out put, create a new map
     * that has the connections going in the other direction, output to input.
     *
     * @protected
     *
     * @param {Array.<Number>} map - connection map
     * @returns {Array.<Number>} the reversed map
     */
    protected makeReverseMap(map: Array<number>): Array<number>;
    /**
     * Call this method to convert the input connector number to the output in
     * the given direction The default encode method just passes the input value
     * through
     *
     * @public
     *
     * @param {Direction} _direction - either right for moving towards the reflector
     * 	or left if moving back
     * @param {Number} input - the specific connection receiving an input
     *
     * @returns {Number} The translated output connector number
     */
    public encode(_direction: Direction, input: number): number;
    /**
     * Call this method to fire an `input` event
     *
     * @protected
     *
     * @param {number | string} input - the input value as either a letter or
     * a number
     * @param {Direction} direction - the direction the signal is heading
     */
    protected fireInput(input: number | string, direction: Direction): void;
    /**
     * Call this method to fire an `output` even
     *
     * @protected
     *
     * @param {number | string} output - the output value as either a letter or
     * a number
     * @param {Direction} direction - the direction the signal is heading
     */
    protected fireOutput(output: number | string, direction: Direction): void;
    /**
     * Call this method to fire a `translate` event
     *
     * @protected
     *
     * @param {number | string} input - the input value as either a letter or
     * a number
     * @param {number | string} output - the output value as either a letter or
     * a number
     * @param {Direction} direction - the direction the signal is heading
     */
    protected fireTranslate(input: number | string, output: number | string, direction: Direction): void;
    /**
     * Call this method to fire the `input`, `output` and `translate` events.
     *
     * @protected
     *
     * @param {number | string} input - the input value as either a letter or
     * a number
     * @param {number | string} output - the output value as either a letter or
     * a number
     * @param {Direction} direction - the direction the signal is heading
     */
    protected fireEncodeSet(input: number | string, output: number | string, direction: Direction): void;
    /**
     * Call this method to add a function to be called when important events
     * happen to a component. The name can be used to later remove the listener
     *
     * @public
     *
     * @param {string} name - the name of the listener
     * @param {Listener} cb - the function to be called.
     */
    public listen(name: string, cb: Listener): void;
    /**
     * Call this method to remove a listener.
     *
     * @public
     *
     * @param {string} name - the name of the listener
     */
    public unlisten(name: string): void;
    /**
     * Call this method to call any event listeners
     *
     * @protected
     *
     * @param {EventName} event - the event being fired
     * @param {String} name - the name of the component firing the event
     * @param {EventData} data - the event data
     */
    protected fire(event: EventName, name: string, data: EventData): void;
}
