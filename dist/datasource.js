"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appd_sdk_1 = require("./appd_sdk");
var AppDynamicsDatasource = (function () {
    function AppDynamicsDatasource(instanceSettings, $q, backendSrv, templateSrv) {
        this.$q = $q;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.appD = new appd_sdk_1.AppDynamicsSDK(instanceSettings, backendSrv);
        this.templateSrv = templateSrv;
    }
    AppDynamicsDatasource.prototype.query = function (options) {
        return this.appD.query(options);
    };
    AppDynamicsDatasource.prototype.testDatasource = function () {
        return this.appD.testDatasource();
    };
    AppDynamicsDatasource.prototype.annotationQuery = function () {
        // TODO implement annotationQuery
    };
    AppDynamicsDatasource.prototype.getApplicationNames = function (query) {
        var interpolated = {
            target: this.templateSrv.replace(query, null, 'regex')
        };
        return this.appD.getApplicationNames(query);
    };
    return AppDynamicsDatasource;
}());
exports.AppDynamicsDatasource = AppDynamicsDatasource;
