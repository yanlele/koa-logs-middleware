const expect = require('chai').expect;
const koaLog = require('../lib/index');
const app = require('../example/app');
const request = require('supertest')(app);

const path = require('path');

describe('mainTest', function () {
    describe('koaLog', function () {
        it('get logger', function () {
            koaLog({
                defaultPath: path.resolve(__dirname, '../lib/logs'),
                applicationName: 'app'
            })();
        });

        it('get method', function (done) {
            request.get('/home')
                .end((err, res) => {
                    expect(res.body).is.a.string;
                    done();
                    if(err) {
                        done(err);
                    }
                })
        });
    })
});