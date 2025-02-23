import inventory from'./Inventory.js';

/**
 * This module adds all the standard inventory components to simulate models
 * I, M3 and M4
 */

export var entryDiscDefinitions = {
	default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
};

export var rotorDefinitions = {
	I: {
		map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', //p->q
		turnovers: 'Q'
	},
	II: {
		map: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', //d->e
		turnovers: 'E'
	},
	III: {
		map: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', // u->v
		turnovers: 'V'
	},
	IV: {
		map: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', // i-> j
		turnovers: 'J'
	},

	V: {
		map: 'VZBRGITYUPSDNHLXAWMJQOFECK', //y->z
		turnovers: 'Z'
	},

	VI: {
		map: 'JPGVOUMFYQBENHZRDKASXLICTW', // l->m, y-z
		turnovers: 'ZM'
	},

	VII: {
		map: 'NZJHGRCXMYSWBOUFAIVLPEKQDT', //l-m
		turnovers: 'ZM'
	},

	VIII: {
		map: 'FKQHTLXOCBJSPDZRAMEWNIUYGV',
		turnovers: 'ZM'
	},

	Beta: {
		map: 'LEYJVCNIXWPBQMDRTAKZGFUHOS',
		turnovers: ''
	},
	Gamma: {
		map: 'FSOKANUERHMBTIYCWLQPZXVGJD',
		turnovers: ''
	}
};

export var reflectorDefinitions = {
	A: 'EJMZALYXVBWFCRQUONTSPIKHGD',
	B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
	C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
	'Thin-B': 'ENKQAUYWJICOPBLMDXZVFTHRGS',
	'Thin-C': 'RDOBJNTKVEHMLFCWZAXGYIPSUQ'
};


function addRotor(name) {
	inventory.addRotor(name, rotorDefinitions[name].map, rotorDefinitions[name].turnovers);;
}

function addReflector(name) {
	inventory.addReflector(name, reflectorDefinitions[name]);
}

inventory.addEntryDisc('default', entryDiscDefinitions.default);

addRotor('I');
addRotor('II');
addRotor('III');
addRotor('IV');
addRotor('V');
addRotor('VI');
addRotor('VII');
addRotor('VIII');

addRotor('Beta');
addRotor('Gamma');

addReflector('A');
addReflector('B');
addReflector('C');
addReflector('Thin-B');
addReflector('Thin-C');
