

type Options = {
	file?: string;
	overwrite?: boolean;
	events?: string;
	step?: boolean;
}

type EnigmaSpec = {
	seed?: number;
	model: Model;
	reflector: string;
	rotors: string[],
	ringSettings: number[] | string;
	plugs: string | string[];
}


type ParseError = {
	error: true;
	message: string;
}

type EnigmaConfig = {
	enigma: EnigmaSpec,
	rotor?: {name: string, ringSetting: number},
	options?: Options,
	encode?: {key: string, message: string},
}

type ParsedRotor = {name: string, rotor: RotorInventorySpec};
type ParsedReflector = {name: string, reflector: ReflectorInventorySpec}

type Parser = (value: string) => any | false | ParseError;
type ParserFields = {[type: string]: {defaultVal: any}};
type ParsedResults = {[type: string]: any}
type ParsedHandler = (type: string, parsed: any, value: any, parsers: ParserFields, results: ParsedResults) => boolean;
