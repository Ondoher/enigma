/**
 * Use this class to generate random enigma configurations and messages. The
 * methods in this class all the use the `Random` object, which can be seeded to
 * produce a reproducible output
 */
export default class Generator {
    /**
     * Call this method to turn a string into valid characters for encryption,
     * which is just the letters A-Z.
     *
     * @public
     *
     * @param {String} text - the original text
     * @returns {String} the text that has been normalized to what the Enigma
     * 	can process
     */
    public cleanMessage(text: string): string;
    /**
     * Call this method to break a string into groups of five letters with a
     * space between them.
     *
     * @public
     *
     * @param {string} text - the original text
     * @param {number} [size] - the size of the text groups, defaults to 5
     *
     * @returns {string} the segmented string
     */
    public groupText(text: string, size?: number): string;
    /**
     * Call this method to generate the given number of sentences. The sentences
     * are pulled from the text of Hamlet.
     *
     * @public
     *
     * @param {Number} count - the number of sentences
     * @returns {String} the sentences separated by a ' ';
     */
    public generateSentences(count: number): string;
    /**
     * Call this method to get the possible setup and configuration options for
     * the given model
     *
     * @public
     *
     * @param {Model} model - one of the standard models
     *
     * @returns {ModelOptions} the possible ways to setup and configure the model
     */
    public getModelOptions(model: Model): ModelOptions;
    /**
     * Call this method to generate a random Enigma configuration
     *
     * @public
     *
     * @param {GeneratorSetup} [setup] - options for settings

     * @returns {SimplifiedConfiguration} the Enigma settings.
     */
    public generateEnigmaConfiguration(setup?: GeneratorSetup): SimplifiedConfiguration;
    /**
     * Call this method to create a random Enigma object.
     * @public
     *
     * @param {string[]} [reflectors] - if given, specifies and alternate list of
     * reflectors. Defaults to ['A', 'B', 'C'];
     */
    public createRandomEnigma(model?: string, reflectors?: string[]): Enigma;
    /**
     * Call this method to generate a random message text encoded with the given
     * Enigma. The random text will be a few sentences from Hamlet.
     *
     * @param {Enigma} enigma - the configured Enigma to use to encode the
     * message
     *
     * @returns {GeneratedMessage} details of the generated text
     */
    generateMessage(enigma: Enigma): GeneratedMessage;
}
import Enigma from '../enigma/Enigma.js';
