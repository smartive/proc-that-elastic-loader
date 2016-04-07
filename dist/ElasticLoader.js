"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Buffer_1 = require('./helpers/Buffer');
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
        this.buffer = new Buffer_1.Buffer();
        this.esClient = new elasticsearch.Client(config);
        if (config.maxSockets) {
            this.buffer = new Buffer_1.Buffer(config.maxSockets);
        }
    }
    ElasticLoader.prototype.write = function (object) {
        var _this = this;
        if (!this.predicate(object)) {
            return Promise.resolve();
        }
        var id = this.idSelector(object);
        if (id === null || id === undefined) {
            return Promise.reject(new NoIdProvidedError(object));
        }
        var promise = this.buffer
            .read()
            .then(function (obj) {
                return _this.esClient.index({
                    index: _this.index,
                    type: _this.type,
            id: id,
            body: object
                });
            });
        this.buffer.write(object);
        return promise;
    };
    return ElasticLoader;
}());
exports.ElasticLoader = ElasticLoader;
//# sourceMappingURL=ElasticLoader.js.map