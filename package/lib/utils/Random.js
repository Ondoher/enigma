/**
 * This class implements a pseudorandom number generator that can be given a
 * seed to produce a consistent sequence of numbers. This algorithm is
 * inappropriate for real cryptographic purposes, but allows the production of
 * output that can be consistently reproduced.
 *
 * This algorithm was stolen from the product Delphi.
 */
class Random {
	constructor() {
		this.randSeed = Date.now();
	}

	/**
	 * Call this method to set the seed value for the randomizer. The initial value
	 * will be the current time in milliseconds.
	 *
	 * @param {Number} value for the seed,
	 */
	randomize(value) {
		value = (value === undefined) ? Date.now() : value;

		this.randSeed = value;
	}

	/**
	 * Call this method to get a random number. If passed a value, the return
	 * will be an integer between 0 and that number - 1. without it will be a
	 * decimal value between 0 and < 1.
	 *
	 * @param {Number} [limit] - if passed the upper boundary of the integer - 1
	 *
	 * @returns {Number} the randomized value as either an integer or a decimal
	 *     value depending on how it was called.
	 */
	random(limit)
	{
		let randPow = Math.pow(2, -31);
		let randLimit = Math.pow(2, 31);
		let magic = 0x8088405;
		let rand = this.randSeed * magic + 1;

		this.randSeed = rand % randLimit

		rand = rand % randLimit
		rand = rand * randPow;

		if (limit) {
			rand = Math.floor(Math.abs(rand) * limit);
		}

		return rand;
	}

	/**
	 * Generate a random number using a bell curve. The curve is created using
	 * the analogy of dice. For example, a random number built with two six
	 * sided dice will have the peak of the curve at 7 with 2 and 12 being at
	 * the bottom.
	 *
	 * @param {number} dice - how many random numbers to pick
	 * @param {number} faces - the range, from 1 - faces, of the number
	 * @param {boolean} [zeroBased] - if true, the random range for each die will be from 0 - faces-1
	 *
	 * @return {number} the random number
	 */
	randomCurve(dice, faces, zeroBased = false) {
		let result = 0;
		let adjust = zeroBased ? 0 : 1
		for (let idx = 0; idx < dice; idx++) {
			result += this.random(faces) + adjust;
		}

		return result;
	}

	/**
	 * call this method to pick a random number from an array and remove it
	 *
	 * @template T
	 * @param {T[]} list - the array of items to choose from
	 *
	 * @returns {T} the chosen item
	 */
	pickOne(list) {
		let pos = Math.floor(this.random() * list.length);
		let choice = list.splice(pos, 1);
		return choice[0];
	}

	/**
	 * Call this method to pick two items from a given list. The items are
	 * removed from the array. If the array is less than two items then it
	 * will return either an empty array or an array with one element.
	 *
	 * @template T
	 *
	 * @param {T[]} list - the array of items to choose
	 * @returns {T[]} the two chosen items
	 */
	pickPair(list) {
		if (list.length === 0) {
			return [];
		}

		if (list.length === 1) {
			return [this.pickOne(list)];
		}

		return [
			this.pickOne(list),
			this.pickOne(list)
		]
	}

	/**
	 * Call this method to choose a given number of items from a list. The items
	 * are removed.
	 *
	 * @template T
	 *
	 * @param {Number} count - the number of items to pick
	 * @param {T[]} list - the list of items to choose from
	 *
	 * @returns {T[]} the chosen items
	 */
	pick(count, list) {
		let result = [];
		let limit = Math.min(list.length, count)
		for(let idx = 0; idx < limit; idx++) {
			result.push(this.pickOne(list));
		}

		return result;
	}


	/**
	 * Call this method to randomly pick a set of item pairs. The items
	 * will be removed from the list.
	 *
	 * @template T
	 * @param {Number} count - the number of pairs to pick
	 * @param {T[]} list - the list of items to choose from
	 *,
	 * @returns {T[][]}} the item pairs chosen. Each pair is an array of
	 * 	two items from the list
	 */
	pickPairs(count, list) {
		/** @type {T[][]} */
		let result = [];

		for(let idx = 0; idx < count; idx++) {
			result.push(this.pickPair(list));
		}

		return result;
	}

	/**
	 * Call this method to chose a random item from a list. The item is not
	 * removed.
	 *
	 * @template T
	 *
	 * @param {T[]} list - the list of items to choose from
	 * @returns {T} the chosen item
	 */
	chooseOne(list) {
		let pos = Math.floor(this.random() * list.length);
		return list[pos];
	}

	/**
	 * Call this method to pick a pair of items from the given list. The items
	 * are guaranteed to be unique.
	 *
	 * @template T
	 *
	 * @param {T[]} list - the list of items
	 * @returns {T[]}
	 */
	choosePair(list) {
		if (list.length < 2) {
			return list;
		}
		let first = Math.floor(this.random() * list.length);
		let second = Math.floor(this.random() * list.length);

		while (second === first) {
			second = Math.floor(this.random() * list.length);
		}

		return [list[first], list[second]];

	}

	/**
	 * Call this method to return a random list of contiguous items from the
	 * given list. The items are not removed.
	 *
	 * @template T
	 * @param {number} count - the number of items to choose
	 * @param {T[]} list - the list to choose from
	 *
	 * return {T[]}
	 */
	chooseRange(count, list) {
		let start = this.random(list.length) -  count;

		return list.slice(start, start + count).join(' ');
	}

	/**
	 * Call this method to randomly pick a subset of items from a list. The
	 * items are not removed.
	 *
	 * @template T
	 *
	 * @param {Number} count - the number of items to choose
	 * @param {T[]} list - the list of items to choose from
	 *
	 * @returns {T[]} the list of items chosen
	 */
	choose(count, list){
		let result = [];
		for(let idx = 0; idx < count; idx++) {
			result.push(this.chooseOne(list));
		}

		return result;
	}

};

export default new Random();
