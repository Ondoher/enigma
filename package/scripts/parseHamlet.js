import {readFile, writeFile} from 'node:fs/promises';

var hamletHtml = await readFile('./hamlet.html', 'utf-8');
var blockRE = /<blockquote>([^]*?)<\/blockquote\>/gm
//var blockRE = /blockquote/g
var blockQuotes = hamletHtml.matchAll(blockRE);
var bqArray = [...blockQuotes];

var text = '';

bqArray.forEach(function(match) {
	var searchText = match[1];
	var textRE = /<A NAME.*?>([^]*?)<\/A/g
	var results = searchText.matchAll(textRE);
	var resultsArray = [...results];

	text = resultsArray.reduce(function(text, match) {
		text += ' ' + match[1];
		return text;
	}, text);
});

var sentenceRE = /([^]*?[?.]) *?/g
var sentencesMatch = text.matchAll(sentenceRE);
var sentenceArray = [...sentencesMatch];
var sentences = sentenceArray.map(function(match) {
	return match[1].trim();
})

await writeFile('./hamlet.json', JSON.stringify(sentences, null, '    '), 'utf-8')

//console.log(bqArray);
