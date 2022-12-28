import '../package/lib/enigma/standardInventory.js'
import Enigma from "../package/lib/enigma/Enigma.js";
import Generator from '../package/lib/generator/Generator.js';
import { writeFile } from "fs/promises";


var generator = new Generator();

var sheet = generator.generateKeySheet(30);
var message = generator.generateMessage(sheet);

console.log(JSON.stringify(message, null, '    '));

/**

var messages = [];

var generator = new Generator();

function generateI(count, list) {
	for (let idx = 0; idx < count; idx++) {
		let message = generator.generateEncodedText({
			rotors: ['I', 'II', 'III', 'IV', 'V'],
			reflectors: ['A', 'B', 'C'],
		})
		list.push({model: 'I', ...message});
	}
}

function generateM3(count, list) {
	for (let idx = 0; idx < count; idx++) {
		let message = generator.generateEncodedText({
			rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
			reflectors: ['A', 'B', 'C'],
		});
		list.push({model: 'M3', ...message});
	}
}

function generateM4(count, list) {
	for (let idx = 0; idx < count; idx++) {
		let message = generator.generateEncodedText({
			reflectors: ['Thin-B', 'Thin-C'],
			rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
			fixed: ['Beta', 'Gamma'],
		})
		list.push({model: 'M4', ...message});
	}
}


var messages = [];

generateI(20, messages);
generateM3(20, messages);
generateM4(20, messages);

await writeFile('./test-messages.json', JSON.stringify(messages, null, '    '), 'utf-8');
/**

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

var enigma = new Enigma({reflector: 'B'});

enigma.configure({
	rotors: ['III', 'VI', 'VIII'],
	ringSettings: [1, 8, 13],
	plugs: 'AN EZ HK IJ LR MQ OT PV SW UX',
});

enigma.listen(function(event, name, message, data) {
	if (['encode', 'encode-left', 'encode-right'].includes(event)) console.log(`${alphabet[data.input]} > ${alphabet[data.output]} ${name} ${data.rotation}`);
	if (event === 'step') console.log('step', name, JSON.stringify(data));
	if (event === 'output') console.log('------------------')
})

var message = 'YKAENZAPMSCHZBFOCUVMRMDPYCOFHADZIZMEFXTHFLOLPZLFGGBOTGOXGRETDWTJIQHLMXVJWKZUASTR';
//YKAENZAPMSCHZBFOCUVMRMDPYCOFHADZIZMEFXTHFLOLPZLFGGBOTGOXGRETDWTJIQHLMXVJWKZUASTR
//STEUEREJTANAFJORDJANSTANDORTQUAAACCCVIERNEUNNEUNZWOFAHRTZWONULSMXXSCHARNHORSTHCO
//STEUEREJTANAFJORDJANSTANDORTQUAAACCCVIERNEUNNEUNZWOFAHRTZWONULSMXXSCHARNHORSTHCO
//STEUEREJTANAFJORDJANSTANDORTQUAAACCCVIERNEUNNEUNZWOFAHRTZWONULSMXXSCHARNHORSTHCO

var clear = enigma.encode('UZV', message)
console.log(message)
console.log(clear);






/*
var enigma = new Enigma({reflector: 'c'});

enigma.configure({
	rotors: ['Beta', 'V', 'VI', 'VIII'],
	ringSettings: 'AAEL',
	plugs: ['AE', 'BF', 'CM', 'DQ', 'HU', 'JN', 'LX', 'PR', 'SZ', 'VW'],
});

var message = 'WJPSBIYBZWEZGBQMUNMKCRJGRICYQWBTXTTULIILIWMGQZCEABYUABINYQPYRNSTPKMHVQSBELHRTDHYBNAKWLRABOMVZPWR';
var clear = enigma.encode('ODBS', message)
console.log(message)
console.log(clear);



/*
var enigma = new Enigma({reflector: 'c'});

enigma.configure({
	rotors: ['Beta', 'V', 'VI', 'VIII'],
	ringSettings: 'AAEL',
	plugs: ['AE', 'BF', 'CM', 'DQ', 'HU', 'JN', 'LX', 'PR', 'SZ', 'VW'],
});

var message = 'WJPSBIYBZWEZGBQMUNMKCRJGRICYQWBTXTTULIILIWMGQZCEABYUABINYQPYRNSTPKMHVQSBELHRTDHYBNAKWLRABOMVZPWR';
var clear = enigma.encode('ODBS', message)
console.log(message)
console.log(clear);
//LIRZMLWRCDMSNKLKBEBHRMFQFEQAZWXBGBIEXJPYFCQAAWSEKDEACOHDZKCZTOVSYHFNSCMAIMIMMAVJNLFXEWNPUIRINOZNCRVDHCGKCYRVUJQPVKEUIVVXGLQMKRJMDMLXLLRLYBKJWRXBQRZWGCCNDOPMGCKJ
//UUUVIRSIBENNULEINSYNACHRXUUUSTUETZPUNKTLUEBECKVVVCHEFVIERXUUUFLOTTXXMITUUUVIERSIBENNULZWOUNDUUUVIERSIBENNULDREIZURFLENDERWERFTLUEBECKGEHENXFONDORTFOLGTWEITERESX
//UUUZWODREIDREIACHTVVVCHEFVIERXUUUFLOTTXXMITUUUZWODREISECHSEINSZUMDOCKBETRIEBRENDSBURGENTLASSENXK
//UUUZWODREIDREIACHTVVVCHEFVIERXUUUFLOTTXXMITUUUZWODREISECHSEINSZUMDOCKBETRIEBRENDSBURGENTLASSENXK


/*
var enigma = new Enigma({reflector: 'b'});
enigma.configure({
	rotors: ['Gamma', 'IV', 'III', 'VIII'],
	ringSettings: 'AACU',
	plugs: ['CH', 'EJ', 'NV', 'OU', 'TY', 'LG', 'SZ', 'PK', 'DI', 'QB'],

});

var message = 'EFLP BHCF KMRP FQYX AGED UVAS MXLY MBPR YTWS ZMJC HZIV DJYB PMNH'//H RAPDLZTABQHFIOSBQIBLRWOWAOVSCIIBZDDRENHDGKVPCZGUWMCO';
var clear = enigma.encode('FURO', message)
console.log(message)
console.log(clear);

//            XUUU FLOT TXVV VUUU FUNF DREI VIER KKNO LLAU KKEI NSAC HTUH RIM      Y ADXT HILSZRNYHCAXVZSODHTUHSALDVVPWPNJPEPUVXPZWJDWYKNV


/*
var enigma = new Enigma({reflector: 'B'});
enigma.configure({
	rotors: ['III', 'II', 'I'],
	ringSetting: 'AAA',
	plugs: ['AB', 'IR', 'UX', 'KP']
});



var message = 'P';//CDAONONEBCJBOGLYMEEYGSHRYUBUJHMJOQZLEX'
var clear = enigma.encode('FRA', message)
console.log(message, clear);
/**/



//var generator = new Generator(false);

//var message = generator.generateIndependentMesage();
//console.log(message);
/*
var message = 'AAAAA'
var encoded = enigma.encode('AAA', message);
var clear = enigma.encode('AAA', encoded)
console.log(encoded, clear);

215 AAA FRA "ABIRUXKP" PCDAONONEBCJBOGLYMEEYGSHRYUBUJHMJOQZLEX

The first line is the setup.

215 rotor order (Walzenlage) means left wheel number 2, middle wheel number one and right wheel number 5.

AAA is the corresponding ring setting (Ringstellung).

FRA is the corresponding starting position (Grundstellung).

AB IR UX KP Plugboard connections (Steckerverbindungen).

And this is the enciphered plain text.

ANBULMEGRAZGOESTINGSTRENGGEHEIMEMELDUNG



*/
