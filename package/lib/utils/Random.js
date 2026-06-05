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
	 * Call this method to get a pseudo-random number from the current generator
	 * state. When called without a limit it returns a floating point number in
	 * the half-open interval [0, 1). When called with a limit it returns an
	 * integer in the half-open interval [0, limit).
	 *
	 * @param {Number} [limit] - optional exclusive upper bound for integer output
	 *
	 * @returns {Number} the randomized value as either a float or bounded integer
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

		if (limit !== undefined) {
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
	 * Generate a normally distributed random number using the Box-Muller transform.
	 *
	 * @param {number} [mean] - center of the distribution
	 * @param {number} [stddev] - standard deviation
	 *
	 * @returns {number} a normally distributed random number
	 */
	randomNormal(mean = 0, stddev = 1) {
		let u1 = 0;
		let u2 = 0;

		// Avoid log(0)
		while (u1 === 0) {
			u1 = this.random();
		}

		while (u2 === 0) {
			u2 = this.random();
		}

		let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

		return z0 * stddev + mean;
	}

	/**
	 * Generate a uniformly distributed integer in the inclusive range [start, end].
	 *
	 * @param {number} start
	 * @param {number} end
	 *
	 * @returns {number} a uniformly distributed integer
	 */
	randomInt(start, end) {
		if (!Number.isInteger(start) || !Number.isInteger(end)) {
			throw new Error('start and end must be integers');
		}

		if (end < start) {
			throw new Error('end must be greater than or equal to start');
		}

		return start + this.random(end - start + 1);
	}

	/**
	 * Generate a normally distributed integer by rounding the output of randomNormal.
	 *
	 * @param {number} [mean] - center of the distribution
	 * @param {number} [stddev] - standard deviation
	 *
	 * @returns {number} a rounded normally distributed integer
	 */
	randomNormalInt(mean = 0, stddev = 1) {
		return Math.round(this.randomNormal(mean, stddev));
	}

	/**
	 * Generate a normally distributed integer within an inclusive range.
	 * Values outside the range are discarded and retried.
	 *
	 * @param {number} start - inclusive lower bound
	 * @param {number} end - inclusive upper bound
	 * @param {number} [mean] - defaults to midpoint
	 * @param {number} [stddev] - defaults to range / 6
	 *
	 * @returns {number} a normally distributed integer within the given range
	 */
	randomNormalRange(start, end, mean = undefined, stddev = undefined) {
		if (!Number.isInteger(start) || !Number.isInteger(end)) {
			throw new Error('start and end must be integers');
		}

		if (end < start) {
			throw new Error('end must be greater than or equal to start');
		}

		if (start === end) {
			return start;
		}

		let width = end - start;
		let center = mean ?? (start + end) / 2;
		let spread = stddev ?? (width / 6);

		while (true) {
			let value = this.randomNormalInt(center, spread);
			if (value >= start && value <= end) {
				return value;
			}
		}
	}

	/**
	 * Convenience alias for a bell-shaped integer over an inclusive range.
	 *
	 * @param {number} start
	 * @param {number} end
	 *
	 * @returns {number} a normally distributed integer within the given range
	 */
	randomBell(start, end) {
		return this.randomNormalRange(start, end);
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
