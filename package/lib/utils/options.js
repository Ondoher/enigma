import * as minimist from "minimist";

/**
 * Call this method to try to convert the input value to a
 * boolean value, if not the return result will be the value passed in
 *
 * @param {string | number | boolean} val - the value to check
 * @returns {string | boolean | number} the converted boolean or the input value
 */
function checkBoolean(val) {
	let boolValues = {
		'true' : true,
		'false': false,
		'on': true,
		'off': false,
		'set': true,
		'clear': false,
	}

    if (val === true) return true;
    if (val === false) return false;

	return boolValues[val] !== undefined ? boolValues[val] : val;
}

/**
 * Call this method to get the value of an option from the cli. It will convert
 * this value to a boolean if it can.
 *
 * @param {minimist.ParsedArgs} argv - the parsed command line
 * @param {String} name - the full name of the option
 * @param {String} short - the short name of the optio
 * @returns {OptionsValue} the value of the option
 */
export function getOption(argv, name, short) {
	if (argv[name] !== undefined) return checkBoolean(argv[name]);
	if (argv[short] != undefined) return checkBoolean(argv[short]);
}

/**
 * Call this method to parse all the command line options, those
 * that start with either - or --.
 *
 * @param {OptionValues} defaults - The default values, these will be returned if they are unchanged
 * @param {minimist.ParsedArgs} argv - the parsed command line
 * @param {OptionsNameMap} nameMap - a mapping between the full name and the short name
 * @returns {OptionValues} the parsed options
 */
export function getOptions(defaults, argv, nameMap) {
    let longNames = Object.keys(nameMap);
    let options = structuredClone(defaults);

    options = longNames.reduce(function(options, long) {
        let short = nameMap[long];
        let option = getOption(argv, long, short);

        options[long] = option ?? options[long];

        return options;
    }, options);

    return options;
}
