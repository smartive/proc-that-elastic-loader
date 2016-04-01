import {ILoad} from 'proc-that/dist/interfaces/ILoad';

let Promise = require('es6-promise').Promise;
let elasticsearch = require('elasticsearch');

class NoIdProvidedError extends Error {
    constructor(private object:any) {
        super('No id provided by object');
    }
}

export class ElasticLoader implements ILoad {
    private esClient:any;

    constructor(config:any, private index:string, private type:string, private predicate:(obj:any) => boolean = o => true, private idSelector:(obj:any) => any = o => o.id) {
        this.esClient = new elasticsearch.Client(config);
    }

    write(object:any):Promise<void> {
        if (!this.predicate(object)) {
            return Promise.resolve();
        }

        let id = this.idSelector(object);

        if (id === null || id === undefined) {
            return Promise.reject(new NoIdProvidedError(object));
        }

        return this.esClient.index({
            index: this.index,
            type: this.type,
            id: id,
            body: object
        });
    }
}