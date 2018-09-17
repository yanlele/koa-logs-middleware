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
                    expect(res.body).is.a('object');
                    done();
                    if(err) {
                        done(err);
                    }
                })
        });
        it('get /test', function (done) {
            request.get('/test/')
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        done(err);
                    } else {
                        expect(res.body).is.a('object');
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
                        done()
                    }
                })
        });
    })
});