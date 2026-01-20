// type Listener = (
// 	/** name of the event being fired*/
// 	event: string,

// 	/** the name of th component firing the event */
// 	name: string,

// 	/** a human readable description of the event */
// 	message: string,

// 	/** event specific data */
// 	info: object

// ) => void;



type Listener = (...params: unknown[]) => void;

interface EncoderSetup {
	/** if specified defines an alternate alphabet for the enigma */
	alphabet?: string;

	/** if set, specifies a function to be called as the event listener */
	cb?: Listener;

	/** a string that defines the mapping between the input and output
	 * connectors. The index into the string is the input connector and the
	 * value of this string at that index is the output connector. For example,
	 * 'YRUHQSLDPXNGOKMIEBFZCWVJAT' which is the map for standard reflector B. */
	map?: string;
}

/**
 * Defines how the enigma hardware is constructed. These are the settings that
 * cannot be changed
 */
interface EnigmaSetup extends EncoderConfiguration {
	/** which entry disc is part of the machine, defaults to "default" */
	entryDisc?: string;
	/** which reflector is part of the machine */
	reflector: string;
	/** Which alphabet is defined for the machine, defaults to A-Z */
	alphabet?: string;
	/** The name of the enigma model, defaults to the string "Enigma" */
	model?: string;
}

/**
 * Defines the setup of the plug configuration. It is wither an array of strings
 * or a single string. If it is a string, it must be  a space separated list of
 * letter pairs that connects one input letter to another. If it is an array
 * then then each item is a pair of letters to specify how the plugs are connected
 */
type Plugs = string | string[];

/**
 * The configuration of the Enigma. These settings represent the aspects of the
 * Enigma that can can change for daily configuration.
 */
type EnigmaConfiguration = {
	/** defines how the plugs on the plugboard are configured. Defaults to no
	 * plugs */
	plugs?: Plugs;

	/**
	 * Array of installed rotors. The order here is significant and is given in
	 * the left to right direction. 	This means that last name in this list
	 * is the first rotor used in the forward direction and last used in the
	 * backward direction. Each element is the name of the rotor to use in the
	 * corresponding position. Stepping	stops at the first fixed rotor	 *
	 */
	rotors: string[];

	/**
	 * Specifies the setup of the ringSettings. This can specify as string of
	 * letters or an array of numbers. Each letter in the string is used for the
	 * rotor at that index. It's position in the alphabet is the offset for the
	 * ring settings. If it is an array of number, each number is the one based
	 * offset for the ring settings for the related rotor.
	 */
	ringSettings?: number[] | string;
}

/**
 * Defines the setup of a Rotor. These are the unchangeable settings for the
 * rotor
 */
interface RotorSetup extends EncoderSetup {
	/** specifies how far forward to offset the outer ring relative to the
	 * internal wiring. */
	ringSetting?: number;
	/** specifies the relative* location of where on the rotor turnover will
	 * occur. The value is the what would be displayed in the window when
	 * turnover happens, expressed as a character. The standard rotors VI-VIII,
	 * available in the later model M3 had two turnover locations, M and Z.
	 * Provide an empty string when the rotor does not rotate during stepping */
	turnovers?: string;
}

type Direction = ("right"|"left")
