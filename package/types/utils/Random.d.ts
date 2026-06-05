declare const _default: Random;
export default _default;
/**
 * This class implements a pseudorandom number generator that can be given a
 * seed to produce a consistent sequence of numbers. This algorithm is
 * inappropriate for real cryptographic purposes, but allows the production of
 * output that can be consistently reproduced.
 *
 * This algorithm was stolen from the product Delphi.
 */
declare class Random {
    randSeed: number;
    /**
     * Call this method to set the seed value for the randomizer. The initial value
     * will be the current time in milliseconds.
     *
     * @param {Number} value for the seed,
     */
    randomize(value: number): void;
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
    random(limit?: number): number;
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
    randomCurve(dice: number, faces: number, zeroBased?: boolean): number;
    /**
     * Generate a normally distributed random number using the Box-Muller transform.
     *
     * @param {number} [mean] - center of the distribution
     * @param {number} [stddev] - standard deviation
     *
     * @returns {number} a normally distributed random number
     */
    randomNormal(mean?: number, stddev?: number): number;
    /**
     * Generate a uniformly distributed integer in the inclusive range [start, end].
     *
     * @param {number} start
     * @param {number} end
     *
     * @returns {number} a uniformly distributed integer
     */
    randomInt(start: number, end: number): number;
    /**
     * Generate a normally distributed integer by rounding the output of randomNormal.
     *
     * @param {number} [mean] - center of the distribution
     * @param {number} [stddev] - standard deviation
     *
     * @returns {number} a rounded normally distributed integer
     */
    randomNormalInt(mean?: number, stddev?: number): number;
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
    randomNormalRange(start: number, end: number, mean?: number | undefined, stddev?: number | undefined): number;
    /**
     * Convenience alias for a bell-shaped integer over an inclusive range.
     *
     * @param {number} start
     * @param {number} end
     *
     * @returns {number} a normally distributed integer within the given range
     */
    randomBell(start: number, end: number): number;
    /**
     * call this method to pick a random number from an array and remove it
     *
     * @template T
     * @param {T[]} list - the array of items to choose from
     *
     * @returns {T} the chosen item
     */
    pickOne<T>(list: T[]): T;
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
    pickPair<T>(list: T[]): T[];
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
    pick<T>(count: number, list: T[]): T[];
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
    pickPairs<T>(count: number, list: T[]): T[][];
    /**
     * Call this method to chose a random item from a list. The item is not
     * removed.
     *
     * @template T
     *
     * @param {T[]} list - the list of items to choose from
     * @returns {T} the chosen item
     */
    chooseOne<T>(list: T[]): T;
    /**
     * Call this method to pick a pair of items from the given list. The items
     * are guaranteed to be unique.
     *
     * @template T
     *
     * @param {T[]} list - the list of items
     * @returns {T[]}
     */
    choosePair<T>(list: T[]): T[];
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
    chooseRange<T>(count: number, list: T[]): string;
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
    choose<T>(count: number, list: T[]): T[];
}
