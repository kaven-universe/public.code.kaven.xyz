/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-public] /js/combination.js
 * @create:      2022-12-07 13:21:26.732
 * @modify:      2022-12-07 13:36:40.540
 * @times:       8
 * @lines:       54
 * @copyright:   Copyright © 2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

// From: https://www.geeksforgeeks.org/print-all-possible-combinations-of-r-elements-in-a-given-array-of-size-n/

/**
 * @param {number} n 
 * @param {number[]} values 
 */
function printCombination(n, values) {
    // A temporary array to store all combination one by one
    let data = new Array(n);

    /**
     * @param {number} dataIndex 
     * @param {number} valueIndex 
     */
    function getCombination(dataIndex, valueIndex) {
        // Current combination is ready to be printed, print it
        if (dataIndex == n) {
            console.info(data.join(", "));
            return;
        }

        // When no more elements are there to put in data[]
        if (valueIndex >= values.length) {
            return;
        }

        // current is included, put next at next location
        data[dataIndex] = values[valueIndex];
        getCombination(dataIndex + 1, valueIndex + 1);

        // current is excluded, replace it with next (Note that valueIndex+1 is passed, but dataIndex is not changed)
        getCombination(dataIndex, valueIndex + 1);
    }

    // Print all combination using temporary array 'data[]'
    getCombination(0, 0);
}

printCombination(5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
