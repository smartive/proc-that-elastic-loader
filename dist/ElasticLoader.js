"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Promise = require('es6-promise').Promise;
var elasticsearch = require('elasticsearch');
var NoIdProvidedError = (function (_super) {
    __extends(NoIdProvidedError, _super);
    function NoIdProvidedError(object) {
        _super.call(this, 'No id provided by object');
        this.object = object;
    }
    return NoIdProvidedError;
}(Error));
var ElasticLoader = (function () {
    function ElasticLoader(config, index, type, predicate, idSelector) {
        if (predicate === void 0) { predicate = function (o) { return true; }; }
        if (idSelector === void 0) { idSelector = function (o) { return o.id; }; }
        this.index = index;
        this.type = type;
        this.predicate = predicate;
        this.idSelector = idSelector;
        this.esClient = new elasticsearch.Client(config);
    }
    ElasticLoader.prototype.write = function (object) {
        if (!this.predicate(object)) {
            return Promise.resolve();
        }
        var id = this.idSelector(object);
        if (id === null || id === undefined) {
            return Promise.reject(new NoIdProvidedError(object));
        }
        return this.esClient.index({
            index: this.index,
            type: this.type,
            id: id,
            body: object
        });
    };
    return ElasticLoader;
}());
exports.ElasticLoader = ElasticLoader;
//# sourceMappingURL=ElasticLoader.js.map