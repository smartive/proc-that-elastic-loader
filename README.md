# ElasticLoader

Loader for `proc-that`. Loads processed items into an elasticsearch index.

##### A bunch of badges

[![Build Status](https://travis-ci.org/smartive/proc-that-elastic-loader.svg?maxAge=3600)](https://travis-ci.org/smartive/proc-that-elastic-loader)
[![Build Status](https://ci.appveyor.com/api/projects/status/382q34ka9its372v?svg=true)](https://ci.appveyor.com/project/buehler/proc-that-elastic-loader)
[![npm](https://img.shields.io/npm/v/proc-that-elastic-loader.svg?maxAge=3600)](https://www.npmjs.com/package/proc-that-elastic-loader)
[![Coverage status](https://img.shields.io/coveralls/smartive/proc-that-elastic-loader.svg?maxAge=3600)](https://coveralls.io/github/smartive/proc-that-elastic-loader)
[![license](https://img.shields.io/github/license/smartive/proc-that-elastic-loader.svg?maxAge=2592000)](https://github.com/smartive/proc-that-elastic-loader)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/smartive/proc-that-elastic-loader.svg)](https://greenkeeper.io/)

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
