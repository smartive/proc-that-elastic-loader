import { Client, ClientOptions } from '@elastic/elasticsearch';
import { Loader } from 'proc-that';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { Buffer } from './helpers/Buffer';

class NoIdProvidedError extends Error {
  constructor(public object: any) {
    super('No id provided by object');
  }
}

export class ElasticLoader implements Loader {
  private esClient: Client;
  private buffer: Buffer<any>;

  constructor(
    config: ClientOptions,
    private index: string,
    private predicate: (obj: any) => boolean = () => true,
    private idSelector: (obj: any) => any = (o) => o.id,
    bufferSize = 10
  ) {
    const esConfig = JSON.parse(JSON.stringify(config)) as ClientOptions;
    if (!esConfig.requestTimeout) {
      // set requestTimeout to 5min.
      // reason: when you shoot many index requests to the esClient, elasticsearch buffers your requests.
      // after the default timeout of 30s is exceeded, you receive a TimeoutError and the whole index process fails.
      esConfig.requestTimeout = 1000 * 60 * 5;
    }

    this.buffer = new Buffer(bufferSize);
    this.esClient = new Client(esConfig);
  }

  public write(object: any): Observable<any> {
    if (!this.predicate(object)) {
      return EMPTY;
    }

    const id = this.idSelector(object);

    if (id === null || id === undefined) {
      return throwError(() => new NoIdProvidedError(object));
    }

    const promise = this.buffer.read().then(() =>
      this.esClient.index({
        id,
        index: this.index,
        body: object,
      })
    );

    this.buffer.write(object);

    return from(promise);
  }
}
