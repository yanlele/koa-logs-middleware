const expect = require('chai').expect;
const {arrayToString} = require('../utils/index');

describe('tool test', function () {
    it('should be string', function () {
        let arr = [1,2,3,4];
        console.log(arrayToString(arr));
        expect(arrayToString(arr)).is.a('string');
    });
});