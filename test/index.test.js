const expect = require('chai').expect;
const koaLog = require('../lib/index');
const app = require('../example/app');
const request = require('supertest')(app.listen(3000));

const path = require('path');

describe('mainTest', function () {
    describe('service koaLog', function () {
        it('get method', function (done) {
            request.get('/home')
                .end((err, res) => {
                    expect(res.body).is.a('object');
                    console.log('res', res.body);
                    done();
                    if(err) {
                        done(err);
                    }
                })
        });
        it('get /test', function (done) {
            request.get('/test/?name=test')
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        done(err);
                    } else {
                        expect(res.body).is.a('object');
                        console.log('res', res.body);
                        done();
                    }
                })
        });
        it('get /err/', function (done) {
            request.get('/err/?name=test')
                .end((err, res) => {
                    if(err) {
                        done(err);
                    } else {
                        expect(res.body).is.a('object');
                        console.log('res', res.body);
                        done();
                    }
                })
        });
        it('post /test/', function (done) {
            request.post('/test/')
                .set('Accept', 'application/json')
                .expect(200)
                .send({
                    name: 'yanle',
                    age: 25
                })
                .end((err, res) => {
                    if(err) {
                        done(err)
                    } else {
                        expect(res.body).is.an('object');
                        console.log('res', res.body);
                        done()
                    }
                })
        });
    })
});