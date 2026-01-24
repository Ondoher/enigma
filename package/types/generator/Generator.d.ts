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
     * @param {String} text the original text
     * @returns {String} the text that has been normalized to what the Enigma
     * 	can process
     */
    cleanMessage(text: string): string;
    /**
     * Call this method to break a string into groups of five letters with a
     * space between them.
     *
     * @param {string} text - the original text
     * @param {number} [size] - the size of the text groups, defaults to 5
     *
     * @returns {string} the segmented string
     */
    groupText(text: string, size?: number): string;
    /**
     * Call this method to generate the given number of sentences. The sentences
     * are pulled from the text of Hamlet.
     *
     * @param {Number} count the number of sentences
     * @returns {String} the sentences separated by a ' ';
     */
    generateSentences(count: number): string;
    /**
     * Call this method to get the possible setup and configuration options for
     * the given model
     *
     * @param {Model} model
     *
     * @returns {ModelOptions}
     */
    getModelOptions(model: Model): ModelOptions;
    /**
     * Call this method to generate a random Enigma configuration
     *
     * @param {GeneratorSetup} [setup] options for settings

     * @returns {SimplifiedConfiguration} the Enigma settings.
     */
    generateEnigmaConfiguration(setup?: GeneratorSetup): SimplifiedConfiguration;
    /**
     *
     * @param {string[]} [reflectors] if given, specifies and alternate list of
     * reflectors. Defaults to ['A', 'B', 'C'];
     */
    createRandomEnigma(model?: string, reflectors?: string[]): Enigma;
    /**
     * Call this method to generate a random message text encoded with the given
     * Enigma. The random text will be a few sentences from Hamlet.
     *
     * @param {Enigma} enigma
     *
     * @returns {GeneratedMessage} details of the generated text
     */
    generateMessage(enigma: Enigma): GeneratedMessage;
}
import Enigma from '../enigma/Enigma.js';
