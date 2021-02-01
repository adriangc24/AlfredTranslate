const fetch = require('node-fetch');
const yargs = require('yargs');
const translate = require('@vitalets/google-translate-api');
const clipboardy = require('clipboardy');
var result, requestCounter = 0;

const argv = yargs
	.option('phrase', {
		description: 'Specify the phrase to translate',
		alias: 'p',
		type: 'string',
	})
	.option('language', {
		alias: 'l',
		description: 'Tells the target language to translate',
		type: 'string',
	})
	.help()
	.alias('help', 'h')
	.argv;

let phrase = argv.p;
let targetLanguage = argv.l;
argv.l ? targetLanguage = argv.l : targetLanguage = 'es';
argv.p ? phrase = argv.p : phrase = clipboardy.readSync();

endTranslate = () => {
	process.stdout.write(result);
}

translatePhrase = async (phrase, targetLanguage) => {
	if (requestCounter++ > 2) throw new Error("Maximum requests reached")
	translate(phrase, { to: targetLanguage }).then(res => {
		result = res.text;
		phrase === result ? translatePhrase(phrase, 'en') : endTranslate();
	}).catch(err => {
		console.error(err);
	});

	/* const res = await fetch("https://libretranslate.com/translate", {
		method: "POST",
		body: JSON.stringify({
			q: phrase,
			source: "auto",
			target: targetLanguage
		}),
		headers: { "Content-Type": "application/json" }
	});
	result = await res.json();
	result === phrase ? translatePhrase(result,'en') : endTranslate();  */
}

translatePhrase(phrase, targetLanguage);
