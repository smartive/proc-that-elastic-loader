import { Buffer } from '../src/helpers/Buffer';

describe('Buffer<any>', () => {

    let buf: Buffer<any>;

    beforeEach(() => {
        buf = new Buffer<any>();
    });

    it('should set size to default 10', () => {
        expect(buf.size).toBe(10);
    });

    it('should extend EventEmitter', () => {
        expect(buf.addListener).toBeDefined();
    });

    it('should be empty on init', () => {
        expect(buf.isEmpty).toBeTruthy();
    });

    it('should not be full on init', () => {
        expect(buf.isFull).toBeFalsy();
    });

    it('should change size with property', () => {
        expect(buf.size).toMatchSnapshot();
        buf.size = 20;
        expect(buf.size).toMatchSnapshot();
    });

    describe('read()', () => {

        it('should return a Promise', () => {
            buf.write('');
            expect(buf.read()).toBeInstanceOf(Promise);
        });

        it('should not resolve without write while empty', done => {
            buf.read().then(obj => {
                done(new Error('promise returned'));
            });

            setTimeout(() => {
                done();
            }, 500);
        });

        it('should resolve on write', async () => {
            expect(buf.read()).resolves.toBe('hello');
            await buf.write('hello');
        });

        it('should emit release event', () => {
            const spy = jest.fn();
            buf.on('release', spy);
            buf.read();
            buf.write('');
            expect(spy.mock.calls.length).toBe(1);
        });

    });

    describe('write()', () => {

        beforeEach(done => {
            buf.size = 1;
            buf.write('hello').then(() => done());
        });

        it('should return a Promise', () => {
            buf.read();
            expect(buf.write('')).toBeInstanceOf(Promise);
        });

        it('should not resolve without read while full', done => {
            buf.write('world').then(obj => {
                done(new Error('promise returned'));
            });

            setTimeout(() => {
                done();
            }, 500);
        });

        it('should resolve on read', async () => {
            buf.write('world');

            expect(await buf.read()).toBe('hello');
            expect(await buf.read()).toBe('world');
        });

        it('should emit write event', () => {
            let spy = jest.fn();
            buf.on('write', spy);
            buf.read();
            buf.write('');
            expect(spy.mock.calls.length).toBe(1);
        });

    });

});
