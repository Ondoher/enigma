

type Options = {
	file?: string;
	overwrite?: boolean;
	events?: string;
	step?: boolean;
}

type EnigmaConfig = {
	enigma: {
		name: string;
		reflector: string;
		rotors: string[],
		ringSettings: number[] | string;
		plugs: string | string[];
	},
	rotor?: string,
	options?: Options,
	encode?: string,
}
