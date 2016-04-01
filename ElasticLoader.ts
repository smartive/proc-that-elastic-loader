import {ILoad} from 'proc-that/dist/interfaces/ILoad';

let Promise = require('es6-promise').Promise;
let elasticsearch = require('elasticsearch');

export class ElasticLoader implements ILoad {
    private esClient:any;

    constructor(config:any, private index:string, private type:string, private idSelector:(obj:any) => any = o => o.id, private predicate:(obj:any) => boolean = o => true) {
        this.esClient = new elasticsearch.client(config);
    }

    write(object:any):Promise<void> {
        if (!this.predicate(object)) {
            return Promise.resolve();
        }

        return this.esClient.index({
            index: this.index,
            type: this.type,
            id: this.idSelector(object),
            body: object
        });
    }
}