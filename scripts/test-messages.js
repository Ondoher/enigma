import { readFile } from "fs/promises";
import Enigma from "./test.js";
import { alphabet } from "./Inventory.js";

var enigma = new Enigma('I', 'B', alphabet);
var sheet = JSON.parse(await readFile('./keysheet.json', 'utf-8'));
var messages = JSON.parse(await readFile('./messages.json', 'utf-8'));

function findDay(sheet, indicator) {
	return sheet.find(function (day) {
		return day.indicators.includes(indicator);
	});
}

function clean(text) {
	text = text.replace(/ZIZ/g, ',');
	text = text.replace(/YIY/g, '.');
	text = text.replace(/XIX/g, '?');
	text = text.replace(/WIW/g, ' ');
	text = text.replace(/VIV/g, '\'');
	text = text.replace(/UIU/g, '"');
	text = text.replace(/NULL/g, '0');
	text = text.replace(/ONE/g, '1');
	text = text.replace(/TWO/g, '2');
	text = text.replace(/THREE/g, '3');
	text = text.replace(/FOUR/g, '4');
	text = text.replace(/FIVE/g, '5');
	text = text.replace(/SIX/g, '6');
	text = text.replace(/SEVEN/g, '7');
	text = text.replace(/EIGHT/g, '8');
	text = text.replace(/NINE/g, '9');

	return text;
}

function parsePart(sheet, part) {
	var indicator = part.text.slice(2, 5);
	indicator = indicator.toLowerCase();
	var day = findDay(sheet, indicator);
	var text = part.text.slice(6);
	text = text.replace(/ /g, '');

	enigma.configure(day.plugs, day.rotors, day.ringSettings);
	var start = enigma.encode(part.key, part.enc);
	text = enigma.encode(start, text);

	return text.trim();
}

function parseMessage(sheet, message) {
	return message.map(function(part) {
		return parsePart(sheet, part)
	}).join('');
}

messages.forEach(function(message, idx) {
	console.log('\nMESSAGE', idx, '-------------------------')
	console.log(clean(parseMessage(sheet, message)))
})
parseMessage(sheet, messages[0])
