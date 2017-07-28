"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datasource_1 = require("./datasource");
exports.Datasource = datasource_1.AppDynamicsDatasource;
var query_ctrl_1 = require("./query_ctrl");
exports.QueryCtrl = query_ctrl_1.AppDynamicsQueryCtrl;
var AppDynamicsConfigCtrl = (function () {
    function AppDynamicsConfigCtrl() {
    }
    AppDynamicsConfigCtrl.templateUrl = 'partials/config.html';
    return AppDynamicsConfigCtrl;
}());
exports.ConfigCtrl = AppDynamicsConfigCtrl;
var AppDynamicsQueryOptionsCtrl = (function () {
    function AppDynamicsQueryOptionsCtrl() {
    }
    AppDynamicsQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
    return AppDynamicsQueryOptionsCtrl;
}());
exports.QueryOptionsCtrl = AppDynamicsQueryOptionsCtrl;
