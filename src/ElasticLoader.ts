import { Loader } from 'proc-that';
import { Observable } from 'rxjs';

import { Buffer } from './helpers/Buffer';

const elasticsearch = require('elasticsearch');

class NoIdProvidedError extends Error {
    constructor(public object: any) {
        super('No id provided by object');
    }
}

export class ElasticLoader implements Loader {
    private esClient: any;
    private buffer: Buffer<any> = new Buffer();

    constructor(
        config: any,
        private index: string,
        private type: string,
        private predicate: (obj: any) => boolean = () => true,
        private idSelector: (obj: any) => any = o => o.id,
    ) {
        const esConfig = JSON.parse(JSON.stringify(config));
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

    public write(object: any): Observable<any> {
        if (!this.predicate(object)) {
            return Observable.empty();
        }

        const id = this.idSelector(object);

        if (id === null || id === undefined) {
            return Observable.throw(new NoIdProvidedError(object));
        }

        const promise = this.buffer
            .read()
            .then(() => this.esClient.index({
                id,
                index: this.index,
                type: this.type,
                body: object,
            }));

        this.buffer.write(object);

        return Observable.fromPromise(promise);
    }
}
