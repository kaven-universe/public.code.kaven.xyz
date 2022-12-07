/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/combination.js
 * @create:      2022-12-07 13:21:26.732
 * @modify:      2022-12-07 14:22:03.563
 * @times:       21
 * @lines:       156
 * @copyright:   Copyright © 2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

// From: https://www.geeksforgeeks.org/print-all-possible-combinations-of-r-elements-in-a-given-array-of-size-n/

/**
 * @param {number[]} values 
 * @param {number} n 
 */
function getCombination(values, n) {
    /**
     * @type number[][]
     */
    const result = [];

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

    return result;
}

/**
 * @param {number[]} values 
 * @param {number} nMax 
 * @param {number} nMin 
 */
function getCombinations(values, nMax, nMin) {
    /**
     * @type number[][]
     */
    const result = [];

    if (!nMax) {
        nMax = values.length;
    }

    if (!nMin) {
        nMin = 1;
    }

    for (let i = nMin; i <= nMax; i++) {
        const r = getCombination(values, i);
        result.push(...r);
    }

    return result;
}

/**
 * @param {number} target 
 * @param {number[]} values 
 * @param {number} nMax 
 * @param {number} nMin 
 */
function getClosest(target, values, nMax, nMin) {
    const r = getCombinations(values, nMax, nMin);
    const list = r.map(data => {
        return {
            sum: data.reduce((p, c) => p + c),
            data,
        }
    });

    list.sort((x, y) => Math.abs(x.sum - target) - Math.abs(y.sum - target));

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
    const r = getCombination([1, 2, 3, 4, 5], 3);
    print(r);
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

    const r1 = getClosest(200, values, 2);
    const r2 = r1.filter(p => p.sum <= 200);
    console.info(r2);
}