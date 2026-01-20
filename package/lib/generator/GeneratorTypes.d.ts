
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

type RouterInventorySpec = {
	 /* a string specifying the connector mapping. The index
	 * 	of the string is the logical coordinate of the connector, the character
	 * 	at that index is the output connector. To be exact, it would be the
	 * 	position of that character in the given alphabet. So, in the map '
	 * 	EKMFLGDQVZNTOWYHXUSPAIBRCJ', input connector 0 would map to output
	 * 	connector 4 and input connector 1 would map to output connector 10.
	 * 	Remember that the connectors are numbered starting at 0.*/
	map: string;
	/* a string of characters representing the
	 * turnover locations on the disk. These letter would be the value shown in
	 * the window to during turnover. In Rotor I this is 'Q' in rotors VI, VII,
	 * and VIII there are two turnover locations, 'M' and 'Z'. Use a empty
	 * string if this is a fixed rotor */
	turnovers: string;
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
}

type Model = ("I" | "M3" | "M4");

type ModelOptions = {
	rotors: string[];
	fixed: string[];
	reflectors: string[];
}
