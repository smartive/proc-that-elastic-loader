import { Observable } from 'rxjs/Observable';

import { ElasticLoader } from '../src/ElasticLoader';

describe('ElasticLoader', () => {

    let loader: ElasticLoader;
    let client: any;

    beforeEach(() => {
        client = {
            index: o => Observable.of(o)
        };

        client.index = jest.fn(client.index);
    });

    it('should resolve on correct usage', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).subscribe(null, done, done);
    });

    it('should use correct index', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).subscribe(null, done, () => {
            try {
                expect(client.index.mock.calls.length).toBe(1);
                expect(client.index.mock.calls[0][0]).toMatchSnapshot();
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should use correct type', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).subscribe(null, done, () => {
            try {
                expect(client.index.mock.calls.length).toBe(1);
                expect(client.index.mock.calls[0][0]).toMatchSnapshot();
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should use correct id', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).subscribe(null, done, () => {
            try {
                expect(client.index.mock.calls.length).toBe(1);
                expect(client.index.mock.calls[0][0]).toMatchSnapshot();
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should use correct body', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).subscribe(null, done, () => {
            try {
                expect(client.index.mock.calls.length).toBe(1);
                expect(client.index.mock.calls[0][0]).toMatchSnapshot();
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should be called on truthly predicate', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType', o => o.text === 'test');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).subscribe(null, done, () => {
            try {
                expect(client.index.mock.calls.length).toBe(1);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should not called on falsly predicate', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType', o => o.text !== 'test');
        (loader as any).esClient = client;

        loader.write({id: 1, text: 'test'}).subscribe(null, done, () => {
            try {
                expect(client.index.mock.calls.length).toBe(0);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should be called with correct id when using custom selector', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType', o => true, o => o.myId);
        (loader as any).esClient = client;

        loader.write({myId: 1, text: 'test'}).subscribe(null, done, () => {
            try {
                expect(client.index.mock.calls.length).toBe(1);
                expect(client.index.mock.calls[0][0]).toMatchSnapshot();
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should reject when no id is provided', done => {
        loader = new ElasticLoader({}, 'testIndex', 'testType');
        (loader as any).esClient = client;

        loader.write({myId: 1, text: 'test'}).subscribe(null, () => {
            done();
        }, () => {
            done(new Error('did not throw.'));
        })
    });

})
;
