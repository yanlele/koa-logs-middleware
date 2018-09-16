const expect = require('chai').expect;
const koaLog = require('../lib/index');
const path = require('path');

describe('mainTest', function () {
    describe('koaLog', function () {
        it('get logger', function () {
            koaLog({
                defaultPath: path.resolve(__dirname, '../lib/logs'),
                applicationName: 'app'
            })();
        });

    })
});