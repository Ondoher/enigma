

type ComponentType = ("Entry Wheel" | "Plugboard" | "Reflector" | "Rotor" | "Enigma")

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
interface EnigmaSetup extends EncoderSetup {
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

/**
 * Defines the possible directions for a translation.
 *
 * - **right** - the signal is moving from the right to the left
 * - **left** - the signal is moving from left to right
 * - **turn-around** - the signal is transitioning between directions, this is
 * sent from the reflector
 * - **end-to-end** - this is the direction used for the Enigma object
 */
type Direction = ("right" | "left" | "turn-around" | "end-to-end");

/**
 * Defines the possible events sent from the enigma components.
 *
 * **translate** - fired when the input signal is changed from one value to another
 * **input** - fired when a signal first enters the component
 * **output** - fired when the signal exits the component
 *
 */
type EventName = ("translate" | "input" | "output" | "step" | "double-step");

/**
 * Defines the common data for an event
 */
type EventBase = {
	/** the name of the component sending the event */
	name: string;

	type: ComponentType;

	/** a human readable description of the event */
	description: string;
}

/**
 * Defines the data sent for a translate event
 */
type TranslateData = {
	/** the event name */
	event: "translate";

	/** the direction the signal was sent */
	direction: Direction;

	/** the starting value */
	input: number | string;

	/** the translated value */
	output: number | string;
}

/**
 * defines the data sent for a rotor step
 */
type StepData = {
	/** the event name */
	event: "step";

	/** the starting rotor position */
	start: number;

	/** the ending rotor position */
	stop: number;

	/** true if the rotor has rotated to its turnover location */
	turnover: boolean;
}

type DoubleStepData = {
	event: "double-step",
	offset: number;
}

/**
 * Defines the data sent with an input event
 */
type InputData = {
	/** the event name */
	event: "input";

	/** the input connection */
	input: number | string;

	/** the direction the signal was sent */
	direction: Direction;
}

/**
 * Defines the data sent with an output event
 */
type OutputData = {
	/** the event name */
	event: "output";

	/** the output connection */
	output: number | string;

	/** the direction the signal was sent */
	direction: Direction;
}

/** Defines the discriminated union for all the event data */
type EventData = EventBase & (TranslateData | StepData | InputData | OutputData | DoubleStepData);

type Listener = (
	/** name of the event being fired*/
	event: string,

	/** the name of th component firing the event */
	name: string,

	/** event specific data */
	data:  EventData
) => void;

type RotorInventorySpec = {
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

type ReflectorInventorySpec = {
	map: string
}
