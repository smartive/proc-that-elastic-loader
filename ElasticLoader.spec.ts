import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {ElasticLoader} from './ElasticLoader';

let Promise = require('es6-promise').Promise;

let should = chai.should();
chai.use(asPromised);
chai.use(sinonChai);

describe('ElasticLoader', () => {

    let loader:ElasticLoader;
    let client:any;
    let stub:any;

    beforeEach(() => {
        client = {
            index: o => Promise.resolve()
        };

        stub = sinon.stub(client, 'index', o => Promise.resolve());
    });

    it('should resolve on correct usage', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).then(done, done);
    });

    it('should use correct index', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).then(() => {
            try {
                client.index.should.have.been.calledOnce;
                client.index.should.have.been.calledWithMatch({
                    index: 'testIndex'
                });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should use correct type', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).then(() => {
            try {
                client.index.should.have.been.calledOnce;
                client.index.should.have.been.calledWithMatch({
                    type: 'testType'
                });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should use correct id', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).then(() => {
            try {
                client.index.should.have.been.calledOnce;
                client.index.should.have.been.calledWithMatch({
                    id: 1
                });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should use correct body', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).then(() => {
            try {
                client.index.should.have.been.calledOnce;
                client.index.should.have.been.calledWithMatch({
                    body: {id: 1, text: 'test'}
                });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should be called on truthly predicate', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType', o => o.text === 'test');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).then(() => {
            try {
                client.index.should.have.been.calledOnce;
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should not called on falsly predicate', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType', o => o.text !== 'test');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).then(() => {
            try {
                client.index.should.not.have.been.called;
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should be called with correct id when using custom selector', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType', o => true, o => o.myId);
        (loader as any).esClient = client;

        loader.write({myId: 1, text: 'test'}).then(() => {
            try {
                client.index.should.have.been.calledOnce;
                client.index.should.have.been.calledWithMatch({
                    id: 1,
                    body: {myId: 1, text: 'test'}
                });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should reject when no id is provided', () => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        return loader.write({myId: 1, text: 'test'})
            .should.eventually.be.rejected;
    });

});
