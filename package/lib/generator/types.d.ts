
/**
 * Defines the options for generating a random Enigma configuration
 */
type GeneratorSetup = {
	/** if specified, limits the rotors to select from, defaults to the unfixed
	 * rotors in the inventory */
	rotors?: string[];
	/** if true a random fixed router will be chosen. If it is an array then one
	 * of the specified rotors will be chosen */
	fixed?: boolean|string[];
	/** */
}

/**
 * This is a simplified version of an Enigma configuration.
 */
type SimplifiedConfiguration = {
	rotors: string[];
	/** an array of zero based offsets for the ring setting for each rotor */
	ringSettings: number[];
	/** ten pairs of plug setups */
	plugs: string;
}

/**
 * One day of a monthly key sheet
 */
type KeySheetLine = {
	/** the day of the month */
	day: number;
	/** the rotors for the day */
	rotors: string[];
	/** an array of zero based offsets for the ring setting for each rotor */
	ringSettings: number[];
	/** ten pairs of plug setups */
	plugs: string;
	/** an array of four three letter strings. This will be unique across a key sheet */
	indicators: string[];
}

/**
 * Defines one part of a message. Long messages may be broken into smaller parts.
 */
type MessagePart = {
	/** a random key for this message chosen by the operator */
	key: string;

	/** the starting position for the rotors, encoded using the chosen key */
	enc: string;

	/** the message text encoded using the unencoded start position. The first
	 * five letters of this text string included the unencrypted key identifier*/
	text: string;

	/** the unencoded start position */
	start: string;

	/** The clear text */
	clear: string;
}

type KeyBookMessage = {
	configuration: SimplifiedConfiguration;
	parts: MessagePart[];
}

type GeneratedMessage = {
	/** three letter start position for the message */
	start: string;
	/** the encoded string */
	encoded: string;
	/** the decoded string */
	decoded: string;
	configuration?: SimplifiedConfiguration;
}

type Model = ("I" | "M3" | "M4");

type ModelOptions = {
	rotors: string[];
	fixed: string[] | boolean;
	reflectors: string[];
}
