import { ILoad } from 'proc-that/dist/interfaces/ILoad';
export declare class ElasticLoader implements ILoad {
    private index;
    private type;
    private predicate;
    private idSelector;
    private esClient;
    constructor(config: any, index: string, type: string, predicate?: (obj: any) => boolean, idSelector?: (obj: any) => any);
    write(object: any): Promise<void>;
}
