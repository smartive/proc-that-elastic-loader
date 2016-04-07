import {ILoad} from 'proc-that/dist/interfaces/ILoad';
import {Buffer} from './helpers/Buffer';

let Promise = require('es6-promise').Promise;
let elasticsearch = require('elasticsearch');

class NoIdProvidedError extends Error {
    constructor(private object:any) {
        super('No id provided by object');
    }
}

export class ElasticLoader implements ILoad {
    private esClient:any;
    private buffer:Buffer<any> = new Buffer();

    constructor(config:any, private index:string, private type:string, private predicate:(obj:any) => boolean = o => true, private idSelector:(obj:any) => any = o => o.id) {
        if (!config.requestTimeout) {
            config.requestTimeout = 1000 * 60 * 10;
        }
        this.esClient = new elasticsearch.Client(config);
        if (config.maxSockets) {
            this.buffer = new Buffer(config.maxSockets);
        }
    }

    write(object:any):Promise<void> {
        if (!this.predicate(object)) {
            return Promise.resolve();
        }

        let id = this.idSelector(object);

        if (id === null || id === undefined) {
            return Promise.reject(new NoIdProvidedError(object));
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

        return promise;
    }
}