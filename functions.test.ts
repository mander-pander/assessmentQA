const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    test('returns an array', () => {
        expect(Array.isArray(shuffleArray([1, 2, 3]))).toBeTruthy();
    });

    test('array length is same as argument length', () => {
        let originalArr = [1, 2, 3, 4];
        expect(shuffleArray(originalArr).length).toEqual(originalArr.length);
    });
})
