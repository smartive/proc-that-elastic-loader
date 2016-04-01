# ElasticLoader [![Build Status](https://travis-ci.org/buehler/proc-that-elastic-loader.svg?branch=master)](https://travis-ci.org/buehler/proc-that-elastic-loader)
Loader for proc-that. Loads processed items into an elasticsearch index.

## Installation

```bash
npm install --save proc-that-elastic-loader
```

## Usage

```typescript
import {Etl} from 'proc-that';
import {ElasticLoader} from 'proc-that-elastic-loader';

let loader = new ElasticLoader({/*es-config*/}, 'index', 'type');

new Etl().addLoader(loader).start().subscribe(/*...*/);
```

### Custom id selector

If your object does not have the property "id" or you need to select
a different property for item identification, you can set the last constructor
parameter `idSelector` and use a custom function.

```typescript
import {Etl} from 'proc-that';
import {ElasticLoader} from 'proc-that-elastic-loader';

let loader = new ElasticLoader({/*es-config*/}, 'index', 'type', o => true, obj => obj.notDefaultId);

new Etl().addLoader(loader).start().subscribe(/*...*/);
```

### Predicate

If you process multiple item types and your items are not stored
into the same index or the same index type, you can use the `predicate` param
to filter the items that are indexed by the loader. In the example below,
all items with `.type === 'Type1'` are only processed by `type1Loader`
 and vice versa.

```typescript
import {Etl} from 'proc-that';
import {ElasticLoader} from 'proc-that-elastic-loader';

let type1Loader = new ElasticLoader({/*es-config*/}, 'index', 'type_1', obj => obj.type === 'Type1');
let type2Loader = new ElasticLoader({/*es-config*/}, 'index', 'type_2', obj => obj.type === 'Type2');

new Etl().addLoader(type1Loader).addLoader(type2Loader).start().subscribe(/*...*/);
```