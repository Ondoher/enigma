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
     * Call this method to get a random number. If passed a value, the return
     * will be an integer between 0 and that number - 1. without it will be a
     * decimal value between 0 and < 1.
     *
     * @param {Number} [limit] if passed the upper boundary of the integer - 1
     *
     * @returns {Number} the randomized value as either an integer or a decimal
     *     value depending on how it was called.
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
     * call this method to pick a random number from an array and remove it
     *
     * @template T
     * @param {T[]} list the array of items to choose from
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
     * @param {T[]} list the array of items to choose
     * @returns {T[]} the two chosen items
     */
    pickPair<T>(list: T[]): T[];
    /**
     * Call this method to choose a given number of items from a list. The items
     * are removed.
     *
     * @template T
     *
     * @param {Number} count the number of items to pick
     * @param {T[]} list the list of items to choose from
     *
     * @returns {T[]} the chosen items
     */
    pick<T>(count: number, list: T[]): T[];
    /**
     * Call this method to randomly pick a set of item pairs. The items
     * will be removed from the list.
     *
     * @template T
     * @param {Number} count the number of pairs to pick
     * @param {T[]} list the list of items to choose from
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
     * @param {T[]} list the list of items to choose from
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
     * @param {number} count
     * @param {T[]} list
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
     * @param {Number} count the number of items to choose
     * @param {T[]} list the list of items to choose from
     *
     * @returns {T[]} the list of items chosen
     */
    choose<T>(count: number, list: T[]): T[];
}
