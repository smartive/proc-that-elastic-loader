import {Loader} from 'proc-that';
import {Observable} from 'rxjs';
import {Buffer} from './helpers/Buffer';

let elasticsearch = require('elasticsearch');

class NoIdProvidedError extends Error {
    constructor(private object:any) {
        super('No id provided by object');
    }
}

export class ElasticLoader implements Loader {
    private esClient:any;
    private buffer:Buffer<any> = new Buffer();

    constructor(config:any, private index:string, private type:string, private predicate:(obj:any) => boolean = o => true, private idSelector:(obj:any) => any = o => o.id) {
        let esConfig = JSON.parse(JSON.stringify(config));
        if (!esConfig.requestTimeout) {
            // set requestTimeout to 5min.
            // reason: when you shoot many index requests to the esClient, elasticsearch buffers your requests.
            // after the default timeout of 30s is exceeded, you receive a TimeoutError and the whole index process fails.
            esConfig.requestTimeout = 1000 * 60 * 5;
        }
        this.esClient = new elasticsearch.Client(esConfig);
        if (esConfig.maxSockets) {
            this.buffer = new Buffer(esConfig.maxSockets);
        }
    }

    write(object: any): Observable<any> {
        if (!this.predicate(object)) {
            return Observable.empty();
        }

        let id = this.idSelector(object);

        if (id === null || id === undefined) {
            return Observable.throw(new NoIdProvidedError(object));
        }

        let promise = this.buffer
            .read()
            .then(obj => this.esClient.index({
                index: this.index,
                type: this.type,
                id: id,
                body: object
            }));

        this.buffer.write(object);

        return Observable.fromPromise(promise);
    }
}