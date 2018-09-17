const expect = require('chai').expect;
const koaLog = require('../lib/index');
const app = require('../example/app');
const request = require('supertest')(app.listen(3000));

const path = require('path');

describe('mainTest', function () {
    describe('koaLog', function () {
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
        it('get /home/test', function (done) {
            request.get('/home/test/')
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