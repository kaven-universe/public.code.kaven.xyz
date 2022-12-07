/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/combination.js
 * @create:      2022-12-07 13:21:26.732
 * @modify:      2022-12-07 16:54:00.897
 * @times:       32
 * @lines:       198
 * @copyright:   Copyright © 2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

// From: https://www.geeksforgeeks.org/print-all-possible-combinations-of-r-elements-in-a-given-array-of-size-n/

/**
 * @param {number[]} values 
 * @param {number} n 
 * @param {boolean} recursion
 */
function getCombination(values, n, recursion) {
    /**
     * @type number[][]
     */
    const result = [];

    if (recursion) {
        /**
         * @param {number[]} data
         * @param {number} dataIndex 
         * @param {number} valueIndex 
         */
        function nextCombination(data, dataIndex, valueIndex) {
            // Current combination is ready to be printed, print it
            if (dataIndex == n) {
                result.push([...data]);
                return;
            }

            // When no more elements are there to put in data[]
            if (valueIndex >= values.length) {
                return;
            }

            // current is included, put next at next location
            data[dataIndex] = values[valueIndex];
            nextCombination(data, dataIndex + 1, valueIndex + 1);

            // current is excluded, replace it with next (Note that valueIndex+1 is passed, but dataIndex is not changed)
            nextCombination(data, dataIndex, valueIndex + 1);
        }

        // Print all combination using temporary array 'data[]'
        nextCombination(new Array(n), 0, 0);
    } else {
        const data = new Array(n);
        const stack = [[0, 0]];

        while (stack.length > 0) {
            const [dataIndex, valueIndex] = stack.pop();

            // Current combination is ready to be printed, print it
            if (dataIndex == n) {
                result.push([...data]);
                continue;
            }

            // When no more elements are there to put in data[]
            if (valueIndex >= values.length) {
                continue;
            }

            data[dataIndex] = values[valueIndex];

            // current is excluded, replace it with next (Note that valueIndex+1 is passed, but dataIndex is not changed)
            stack.push([dataIndex, valueIndex + 1]);

            // current is included, put next at next location
            stack.push([dataIndex + 1, valueIndex + 1]);
        }
    }

    return result;
}

/**
 * @param {number[]} values 
 * @param {number} nMax 
 * @param {number} nMin 
 * @param {boolean} recursion
 */
function getCombinations(values, nMax, nMin, recursion) {
    /**
     * @type number[][]
     */
    let result = [];

    if (!nMax) {
        nMax = values.length;
    }

    if (!nMin) {
        nMin = 1;
    }

    for (let i = nMin; i <= nMax; i++) {
        const r = getCombination(values, i, recursion);
        //result.push(...r); // Maximum call stack size exceeded
        result = [...result, ...r];

        console.info(`done: ${i}`);
    }

    return result;
}

/**
 * @param {number[]} values 
 * @param {number} nMax 
 * @param {number} nMin 
 * @param {boolean} recursion
 */
function getCombinationsWithSum(values, nMax, nMin, recursion) {
    const r = getCombinations(values, nMax, nMin, recursion);

    const list = r.map(data => {
        return {
            sum: data.reduce((p, c) => p + c),
            data,
        }
    });

    list.sort((x, y) => y.sum - x.sum);

    return list;
}

/**
 * @param {number[][]} result 
 */
function print(result) {
    for (const data of result) {
        console.info(data.join(", "));
    }
}

// test1
{
    const r1 = getCombination([1, 2, 3, 4, 5], 3, true);
    const r2 = getCombination([1, 2, 3, 4, 5], 3, false);

    const r3 = r1.map(p => p.toString());
    const r4 = r2.map(p => p.toString());
    if (r3.some(p => !r4.includes(p)) || r4.some(p => !r3.includes(p))) {
        throw new Error();
    }

    print(r1);
}

// test2
{
    const values = [
        169,
        43.74,
        12.9,
        19.7,
        24.6,
        43.51,
        31.8,
        25,
        509,
        579,
        139,
        6.9,
        78.49,
        26.9,
        199,
        9.9,
        2499,
        49.9,
        23.5,
        46.42,
        19.9,
        47.9,
        34.8,
        69,
        128,
        138,
        107,
        314,
    ];

    const r1 = getCombinationsWithSum(values);
    const r2 = r1.filter(p => p.sum <= 200 && p.sum > 190);
    console.info(r2);
}